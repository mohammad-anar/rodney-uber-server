# Flutter Integration Guide: Account Verification & OTP Flow


### B. Send / Resend Verification OTP
Used when a user has a pending account and needs a new OTP code to verify their email.

- **URL**: `POST /auth/send-verification-otp` *(or alias `POST /auth/resend-otp`)*
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "johndoe@example.com"
}
```

- **Success Response (200 OK)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Verification OTP sent to your email successfully.",
  "data": {
    "email": "johndoe@example.com"
  }
}
```

- **Error Response (If already verified - 400 Bad Request)**:
```json
{
  "success": false,
  "message": "Your account is already verified. Please login.",
  "errorMessages": [
    {
      "path": "",
      "message": "Your account is already verified. Please login."
    }
  ]
}
```

---

### C. Verify Account with OTP
Validates the OTP code (valid for 3 minutes) and activates the pending user account.

- **URL**: `POST /auth/verify-account` *(or alias `POST /auth/verify-otp`)*
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "johndoe@example.com",
  "otp": 583921
}
```
*(Note: `otp` can be passed as an Integer `583921` or String `"583921"`)*

- **Success Response (200 OK)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "Account verified successfully. You can now login."
}
```

- **Error Responses**:
  - **Wrong OTP (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "Invalid OTP provided"
  }
  ```
  - **Expired OTP (400 Bad Request)**:
  ```json
  {
    "success": false,
    "message": "OTP has expired. Please request a new verification code."
  }
  ```

---

### D. User Login
Logs in the verified user and issues JWT authentication tokens.

- **URL**: `POST /auth/login`
- **Headers**: `Content-Type: application/json`
- **Request Body**:
```json
{
  "email": "johndoe@example.com",
  "password": "Password123!"
}
```

- **Success Response (200 OK)**:
```json
{
  "success": true,
  "statusCode": 200,
  "message": "User logged in successfully.",
  "data": {
    "accessToken": "eyJhbGciOi...",
    "refreshToken": "eyJhbGciOi...",
    "user": {
      "_id": "66f4a8b1c9e77b0012345678",
      "name": "John Doe",
      "email": "johndoe@example.com",
      "role": "USER",
      "emailVerified": true
    }
  }
}
```

- **Error Response (If not verified - 400 Bad Request)**:
```json
{
  "success": false,
  "message": "Please verify your account, then try to login again"
}
```

---

## 3. Complete Flutter Implementation

### A. HTTP Service (`auth_api_service.dart`)

```dart
import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthApiService {
  static const String baseUrl = 'http://YOUR_SERVER_IP:5000/api/v1';

  /// 1. Register User
  static Future<ApiResponse> register({
    required String name,
    required String email,
    required String password,
    required String deviceId,
    String? phone,
    String? address,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/user'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'name': name,
          'email': email.trim().toLowerCase(),
          'password': password,
          'deviceId': deviceId,
          if (phone != null) 'phone': phone,
          if (address != null) 'address': address,
        }),
      );

      final data = jsonDecode(response.body);
      return ApiResponse(
        isSuccess: response.statusCode == 200 || response.statusCode == 201,
        message: data['message'] ?? 'Registration completed',
        data: data['data'],
      );
    } catch (e) {
      return ApiResponse(isSuccess: false, message: 'Network error: $e');
    }
  }

  /// 2. Send / Resend Verification OTP
  static Future<ApiResponse> sendVerificationOtp(String email) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/send-verification-otp'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email.trim().toLowerCase(),
        }),
      );

      final data = jsonDecode(response.body);
      return ApiResponse(
        isSuccess: response.statusCode == 200,
        message: data['message'] ?? 'OTP request sent',
        data: data['data'],
      );
    } catch (e) {
      return ApiResponse(isSuccess: false, message: 'Network error: $e');
    }
  }

  /// 3. Verify Account with OTP
  static Future<ApiResponse> verifyAccount({
    required String email,
    required String otp,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/verify-account'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email.trim().toLowerCase(),
          'otp': int.tryParse(otp) ?? otp,
        }),
      );

      final data = jsonDecode(response.body);
      return ApiResponse(
        isSuccess: response.statusCode == 200,
        message: data['message'] ?? 'Verification status received',
      );
    } catch (e) {
      return ApiResponse(isSuccess: false, message: 'Network error: $e');
    }
  }

  /// 4. Login User
  static Future<ApiResponse> login({
    required String email,
    required String password,
  }) async {
    try {
      final response = await http.post(
        Uri.parse('$baseUrl/auth/login'),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          'email': email.trim().toLowerCase(),
          'password': password,
        }),
      );

      final data = jsonDecode(response.body);
      return ApiResponse(
        isSuccess: response.statusCode == 200,
        message: data['message'] ?? 'Login status received',
        data: data['data'],
      );
    } catch (e) {
      return ApiResponse(isSuccess: false, message: 'Network error: $e');
    }
  }
}

class ApiResponse {
  final bool isSuccess;
  final String message;
  final dynamic data;

  ApiResponse({
    required this.isSuccess,
    required this.message,
    this.data,
  });
}
```

---

### B. Flutter Account Verification Screen (`verify_account_screen.dart`)

```dart
import 'dart:async';
import 'package:flutter/material.dart';
import 'auth_api_service.dart';

class VerifyAccountScreen extends StatefulWidget {
  final String email;

  const VerifyAccountScreen({Key? key, required this.email}) : super(key: key);

  @override
  State<VerifyAccountScreen> createState() => _VerifyAccountScreenState();
}

class _VerifyAccountScreenState extends State<VerifyAccountScreen> {
  final TextEditingController _otpController = TextEditingController();
  bool _isSubmitting = false;
  bool _isResending = false;

  // Countdown timer for 3 minutes (180 seconds)
  Timer? _timer;
  int _secondsRemaining = 180;
  bool get _canResend => _secondsRemaining == 0;

  @override
  void initState() {
    super.initState();
    _startTimer();
  }

  void _startTimer() {
    setState(() => _secondsRemaining = 180);
    _timer?.cancel();
    _timer = Timer.periodic(const Duration(seconds: 1), (timer) {
      if (_secondsRemaining > 0) {
        setState(() => _secondsRemaining--);
      } else {
        _timer?.cancel();
      }
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    _otpController.dispose();
    super.dispose();
  }

  String get _formattedTime {
    final int minutes = _secondsRemaining ~/ 60;
    final int seconds = _secondsRemaining % 60;
    return '${minutes.toString().padLeft(2, '0')}:${seconds.toString().padLeft(2, '0')}';
  }

  Future<void> _handleVerify() async {
    final otp = _otpController.text.trim();
    if (otp.isEmpty || otp.length < 6) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter the 6-digit OTP code')),
      );
      return;
    }

    setState(() => _isSubmitting = true);
    final result = await AuthApiService.verifyAccount(
      email: widget.email,
      otp: otp,
    );
    setState(() => _isSubmitting = false);

    if (result.isSuccess) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result.message),
          backgroundColor: Colors.green,
        ),
      );
      // Navigate to Login Screen
      Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
    } else {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result.message),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  Future<void> _handleResendOtp() async {
    if (!_canResend || _isResending) return;

    setState(() => _isResending = true);
    final result = await AuthApiService.sendVerificationOtp(widget.email);
    setState(() => _isResending = false);

    if (result.isSuccess) {
      _startTimer();
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('A new OTP has been sent to your email.'),
          backgroundColor: Colors.blueAccent,
        ),
      );
    } else {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(result.message),
          backgroundColor: Colors.redAccent,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFFC18F18);

    return Scaffold(
      appBar: AppBar(
        title: const Text('Verify Your Account'),
        backgroundColor: Colors.white,
        foregroundColor: Colors.black87,
        elevation: 0,
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 24.0, vertical: 20.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Icon(Icons.mark_email_unread_outlined, size: 70, color: primaryColor),
              const SizedBox(height: 20),
              const Text(
                'Enter Verification Code',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 8),
              Text(
                'We have sent a 6-digit code to:\n${widget.email}',
                textAlign: TextAlign.center,
                style: const TextStyle(color: Colors.black54, fontSize: 14),
              ),
              const SizedBox(height: 32),
              TextField(
                controller: _otpController,
                keyboardType: TextInputType.number,
                maxLength: 6,
                textAlign: TextAlign.center,
                style: const TextStyle(fontSize: 24, letterSpacing: 8, fontWeight: FontWeight.bold),
                decoration: InputDecoration(
                  counterText: '',
                  hintText: '000000',
                  hintStyle: TextStyle(color: Colors.grey.shade400, letterSpacing: 8),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: primaryColor, width: 2),
                  ),
                ),
              ),
              const SizedBox(height: 16),
              Center(
                child: Text(
                  _canResend ? 'Code expired' : 'Code expires in: $_formattedTime',
                  style: TextStyle(
                    color: _canResend ? Colors.red : Colors.black54,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton(
                onPressed: _isSubmitting ? null : _handleVerify,
                style: ElevatedButton.styleFrom(
                  backgroundColor: primaryColor,
                  padding: const EdgeInsets.symmetric(vertical: 16),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                ),
                child: _isSubmitting
                    ? const SizedBox(
                        height: 20,
                        width: 20,
                        child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
                      )
                    : const Text(
                        'Verify & Continue',
                        style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Colors.white),
                      ),
              ),
              const SizedBox(height: 16),
              TextButton(
                onPressed: _canResend && !_isResending ? _handleResendOtp : null,
                child: _isResending
                    ? const Text('Sending...')
                    : Text(
                        'Resend OTP Code',
                        style: TextStyle(
                          color: _canResend ? primaryColor : Colors.grey,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```
