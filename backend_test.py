import requests
import sys
import json
from datetime import datetime

class QuantroAPITester:
    def __init__(self, base_url="https://decision-engine-61.preview.emergentagent.com"):
        self.base_url = base_url
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None):
        """Run a single API test"""
        url = f"{self.base_url}/{endpoint}"
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)

            print(f"   Response Status: {response.status_code}")
            
            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2, default=str)}")
                    return True, response_data
                except:
                    print(f"   Response: {response.text}")
                    return True, {}
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text}")
                return False, {}

        except requests.exceptions.RequestException as e:
            print(f"❌ Failed - Network Error: {str(e)}")
            return False, {}
        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test root API endpoint"""
        return self.run_test(
            "Root API Endpoint",
            "GET",
            "api/",
            200
        )

    def test_early_access_submission(self):
        """Test early access email submission"""
        test_email = f"test_{datetime.now().strftime('%H%M%S')}@quantro.com"
        return self.run_test(
            "Early Access Submission",
            "POST",
            "api/early-access",
            200,
            data={"email": test_email}
        )

    def test_early_access_invalid_email(self):
        """Test early access with invalid email"""
        return self.run_test(
            "Early Access Invalid Email",
            "POST",
            "api/early-access",
            400,  # Bad Request for invalid email format
            data={"email": "invalid-email"}
        )

    def test_early_access_missing_email(self):
        """Test early access with missing email"""
        return self.run_test(
            "Early Access Missing Email",
            "POST",
            "api/early-access",
            422,  # FastAPI validation error
            data={}
        )

    def test_get_early_access_signups(self):
        """Test getting early access signups"""
        return self.run_test(
            "Get Early Access Signups",
            "GET",
            "api/early-access",
            200
        )

    def test_status_endpoints(self):
        """Test status check endpoints"""
        # Test creating a status check
        success1, _ = self.run_test(
            "Create Status Check",
            "POST",
            "api/status",
            200,
            data={"client_name": "test_client"}
        )
        
        # Test getting status checks
        success2, _ = self.run_test(
            "Get Status Checks",
            "GET",
            "api/status",
            200
        )
        
        return success1 and success2

def main():
    print("🚀 Starting Quantro API Tests...")
    print("=" * 50)
    
    # Setup
    tester = QuantroAPITester()

    # Run tests
    print("\n📡 Testing API Connectivity...")
    tester.test_root_endpoint()

    print("\n📧 Testing Early Access Functionality...")
    tester.test_early_access_submission()
    tester.test_early_access_invalid_email()
    tester.test_early_access_missing_email()
    tester.test_get_early_access_signups()

    print("\n📊 Testing Status Endpoints...")
    tester.test_status_endpoints()

    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print("❌ Some tests failed!")
        return 1

if __name__ == "__main__":
    sys.exit(main())