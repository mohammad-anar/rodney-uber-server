# Flutter Integration Guide: Device ID & Monthly Promo Code System

This guide explains how to integrate the updated Rodney Uber backend into your Flutter mobile application, specifically covering:
1. **Device ID extraction & unique account registration** (enforcing 1 account per physical device).
2. **Checking Promo Code claim status & 30-day countdown timer**.
3. **Claiming a Promo Code** (1 claim allowed every 30-day rolling window).

---

## 1. Required Flutter Dependencies

Add the following dependencies to your `pubspec.yaml`:

```yaml
dependencies:
  flutter:
    sdk: flutter
  device_info_plus: ^10.1.2
  http: ^1.2.0 # or dio: ^5.4.0
  shared_preferences: ^2.2.2
```

Then run:
```bash
flutter pub get
```

---

## 2. Extracting Unique Device ID in Flutter

Create a helper utility `device_service.dart` to fetch a unique device identifier across Android and iOS:

```dart
import 'dart:io';
import 'package:device_info_plus/device_info_plus.dart';

class DeviceService {
  static final DeviceInfoPlugin _deviceInfo = DeviceInfoPlugin();

  /// Returns a unique, persistent hardware/OS identifier for the device.
  static Future<String> getDeviceId() async {
    try {
      if (Platform.isAndroid) {
        final AndroidDeviceInfo androidInfo = await _deviceInfo.androidInfo;
        // androidInfo.id represents the unique hardware build ID / ANDROID_ID
        return androidInfo.id;
      } else if (Platform.isIOS) {
        final IosDeviceInfo iosInfo = await _deviceInfo.iosInfo;
        // identifierForVendor is unique per vendor per iOS device
        return iosInfo.identifierForVendor ?? 'ios_unknown_device';
      } else {
        return 'unknown_platform_device';
      }
    } catch (e) {
      print('Error getting device ID: $e');
      return 'fallback_device_id';
    }
  }
}
```

---

## 3. Account Registration with Device ID

When registering a new user, send the extracted `deviceId` along with the other required fields.

### API Endpoint:
- **URL**: `POST /api/v1/user`
- **Content-Type**: `multipart/form-data` or `application/json`

### Payload:
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "deviceId": "9b1deb4d-3b7d-4b8f-8d9e-1a2b3c4d5e6f",
  "password": "strongPassword123",
  "phone": "+1234567890",
  "address": "123 Main St"
}
```

### Dart Implementation:
```dart
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'device_service.dart';

class AuthService {
  static const String baseUrl = 'https://api.zeroproofdrive.org/api/v1';

  static Future<Map<String, dynamic>> registerUser({
    required String name,
    required String email,
    required String password,
    String? phone,
    String? address,
  }) async {
    // 1. Get unique Device ID
    final String deviceId = await DeviceService.getDeviceId();

    // 2. Send Registration Request
    final response = await http.post(
      Uri.parse('$baseUrl/user'),
      headers: {'Content-Type': 'application/json'},
      body: jsonEncode({
        'name': name,
        'email': email,
        'deviceId': deviceId,
        'password': password,
        if (phone != null) 'phone': phone,
        if (address != null) 'address': address,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 201) {
      return {'success': true, 'data': data};
    } else {
      // Handles error e.g. "An account has already been registered on this device!"
      return {'success': false, 'message': data['message'] ?? 'Registration failed'};
    }
  }
}
```

---

## 4. Promo Code 30-Day Lifecycle

### Flow Summary:
1. When a user opens the video/rewards screen, call **`GET /api/v1/coupon/claim-status`**.
2. If `canClaim == true`, allow the user to watch the video and claim a promo code.
3. If `canClaim == false`, display a countdown: *"Next promo code available in X days (YYYY-MM-DD)"*.
4. Once the video is completed, call **`POST /api/v1/coupon/claim`** with the `videoId`.

---

## 5. Checking Promo Code Claim Status

### API Endpoint:
- **URL**: `GET /api/v1/coupon/claim-status`
- **Headers**: `Authorization: Bearer <ACCESS_TOKEN>`

### Success Response (`canClaim == true`):
```json
{
  "success": true,
  "message": "Claim status retrieved successfully",
  "statusCode": 200,
  "data": {
    "canClaim": true,
    "lastClaimedAt": null,
    "nextAvailableDate": null,
    "daysRemaining": 0,
    "lastCoupon": null
  }
}
```

### Success Response (`canClaim == false` / Cooldown Active):
```json
{
  "success": true,
  "message": "Claim status retrieved successfully",
  "statusCode": 200,
  "data": {
    "canClaim": false,
    "lastClaimedAt": "2026-10-01T12:00:00.000Z",
    "nextAvailableDate": "2026-10-31T12:00:00.000Z",
    "daysRemaining": 26,
    "lastCoupon": {
      "_id": "66f...",
      "promoCode": "DISCOUNT50",
      "discountValue": 50,
      "source": "UBER"
    }
  }
}
```

---

## 6. Claiming the Monthly Promo Code

### API Endpoint:
- **URL**: `POST /api/v1/coupon/claim`
- **Headers**:
  - `Authorization: Bearer <ACCESS_TOKEN>`
  - `Content-Type: application/json`
- **Body**:
```json
{
  "videoId": "66f4a8b1c9e77b0012345678"
}
```

### Success Response:
```json
{
  "success": true,
  "message": "Promo code claimed successfully",
  "statusCode": 200,
  "data": {
    "coupon": {
      "_id": "67a3f81e...",
      "promoCode": "RODNEY2026",
      "discountType": "PERCENTAGE",
      "discountValue": 25,
      "source": "UBER",
      "expiredAt": "2026-12-31T23:59:59.000Z"
    },
    "claimedAt": "2026-10-05T16:15:00.000Z",
    "nextClaimAvailableDate": "2026-11-04T16:15:00.000Z"
  }
}
```

---

## 7. Complete Flutter Promo Code Service

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class PromoCodeService {
  static const String baseUrl = 'https://api.zeroproofdrive.org/api/v1';

  /// Check if the user is eligible to claim a promo code this month
  static Future<PromoStatusModel> getClaimStatus(String token) async {
    final response = await http.get(
      Uri.parse('$baseUrl/coupon/claim-status'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
    );

    if (response.statusCode == 200) {
      final json = jsonDecode(response.body);
      return PromoStatusModel.fromJson(json['data']);
    } else {
      throw Exception('Failed to fetch promo code status');
    }
  }

  /// Claim the promo code after video completion
  static Future<Map<String, dynamic>> claimPromoCode({
    required String token,
    required String videoId,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/coupon/claim'),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer $token',
      },
      body: jsonEncode({'videoId': videoId}),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200) {
      return {
        'success': true,
        'coupon': data['data']['coupon'],
        'claimedAt': data['data']['claimedAt'],
        'nextAvailableDate': data['data']['nextClaimAvailableDate'],
      };
    } else {
      return {
        'success': false,
        'message': data['message'] ?? 'Could not claim promo code',
      };
    }
  }
}

class PromoStatusModel {
  final bool canClaim;
  final String? lastClaimedAt;
  final String? nextAvailableDate;
  final int daysRemaining;
  final Map<String, dynamic>? lastCoupon;

  PromoStatusModel({
    required this.canClaim,
    this.lastClaimedAt,
    this.nextAvailableDate,
    required this.daysRemaining,
    this.lastCoupon,
  });

  factory PromoStatusModel.fromJson(Map<String, dynamic> json) {
    return PromoStatusModel(
      canClaim: json['canClaim'] ?? false,
      lastClaimedAt: json['lastClaimedAt'],
      nextAvailableDate: json['nextAvailableDate'],
      daysRemaining: json['daysRemaining'] ?? 0,
      lastCoupon: json['lastCoupon'],
    );
  }
}
```

---

## 8. Flutter UI Widget Example

Here is an example showing how to display either the **Claim Button** or the **Countdown Cooldown**:

```dart
import 'package:flutter/material.dart';

class RewardScreen extends StatefulWidget {
  final String token;
  final String videoId;

  const RewardScreen({Key? key, required this.token, required this.videoId})
      : super(key: key);

  @override
  State<RewardScreen> createState() => _RewardScreenState();
}

class _RewardScreenState extends State<RewardScreen> {
  PromoStatusModel? _status;
  bool _isLoading = true;
  String? _claimedCode;

  @override
  void initState() {
    super.initState();
    _loadStatus();
  }

  Future<void> _loadStatus() async {
    setState(() => _isLoading = true);
    try {
      final status = await PromoCodeService.getClaimStatus(widget.token);
      setState(() {
        _status = status;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
    }
  }

  Future<void> _handleClaim() async {
    final result = await PromoCodeService.claimPromoCode(
      token: widget.token,
      videoId: widget.videoId,
    );

    if (result['success']) {
      setState(() {
        _claimedCode = result['coupon']['promoCode'];
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Claimed Code: $_claimedCode')),
      );
      _loadStatus(); // Refresh status to start cooldown
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(result['message'])),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    if (_status == null) {
      return const Center(child: Text('Error loading reward status.'));
    }

    if (!_status!.canClaim) {
      return Card(
        margin: const EdgeInsets.all(16),
        child: Padding(
          padding: const EdgeInsets.all(20),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Icon(Icons.lock_clock, size: 48, color: Colors.orange),
              const SizedBox(height: 12),
              const Text(
                'Monthly Promo Code Already Claimed',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
              ),
              const SizedBox(height: 8),
              Text(
                'Next promo code available in ${_status!.daysRemaining} days.',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.grey),
              ),
            ],
          ),
        ),
      );
    }

    return Column(
      mainAxisSize: MainAxisSize.min,
      children: [
        ElevatedButton.icon(
          onPressed: _handleClaim,
          icon: const Icon(Icons.card_giftcard),
          label: const Text('Claim Monthly Promo Code'),
        ),
        if (_claimedCode != null) ...[
          const SizedBox(height: 12),
          Text(
            'Your Code: $_claimedCode',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.green),
          ),
        ]
      ],
    );
  }
}
```
