<?php

use PHPUnit\Framework\TestCase;
require_once dirname(__DIR__) . "/User.php";
require_once dirname(__DIR__) . "/Database.php";

class UserTest extends TestCase
{
    public function testRegisterUserWithMockedResponse()
    {
        // Create a mock for the PDOStatement
        $stmtMock = $this->getMockBuilder(PDOStatement::class)->getMock();
        $stmtMock->method("execute")->willReturn(true);
        $stmtMock->method("rowCount")->willReturn(0); // Simulate that the email/username does not exist

        // Create a mock for the Database class
        $dbMock = $this->getMockBuilder(Database::class)
            ->disableOriginalConstructor()
            ->getMock();
        $dbMock->method("prepare")->willReturn($stmtMock);

        // Create an instance of the User class with the mocked Database class
        $user = new User($dbMock);

        // Call the register_user method with valid test data
        $result = $user->register_user(
            "testuser",
            "test@example.com",
            "ValidPass123!"
        );

        // Assert that the result does not contain an errors array
        $this->assertIsArray($result);
        $this->assertArrayNotHasKey("register", $result);
    }
    public function testLoginSuccessWithSampleData()
    {
        // Sample user data to be returned by the fetch method
        $sampleUserData = [
            "id" => 1,
            "username" => "sampleUser",
            "email" => "sample@example.com",
            "password" => password_hash("ValidPass123!", PASSWORD_BCRYPT), // Hashed password
        ];

        // Create a mock for the PDOStatement
        $stmtMock = $this->getMockBuilder(PDOStatement::class)->getMock();
        $stmtMock->method("execute")->willReturn(true);
        $stmtMock->method("fetch")->willReturn($sampleUserData);

        // Create a mock for the Database class
        $dbMock = $this->getMockBuilder(Database::class)
            ->disableOriginalConstructor()
            ->getMock();
        $dbMock->method("prepare")->willReturn($stmtMock);

        // Create an instance of the User class with the mocked Database class
        $user = new User($dbMock);

        // Call the check_user method with valid sample data
        $result = $user->check_user("sampleUser", "ValidPass123!");

        // Assert that the result contains the user data and no errors
        $this->assertIsArray($result);
        $this->assertArrayHasKey("user", $result);
        $this->assertEquals("sampleUser", $result["user"]["username"]);
    }
    public function testEmailValidationError()
    {
        $dbMock = $this->getMockBuilder(Database::class)
            ->disableOriginalConstructor()
            ->getMock();

        $user = new User($dbMock);
        $result = $user->register_user(
            "testuser",
            "invalid_email",
            "Password123!"
        );

        $expectedErrors = ["email" => "Invalid email address."];
        $this->assertEquals(
            $expectedErrors,
            $result["register"]["errors"],
            "Email validation error message does not match."
        );
    }

    public function testUsernameValidationError()
    {
        $dbMock = $this->getMockBuilder(Database::class)
            ->disableOriginalConstructor()
            ->getMock();

        $user = new User($dbMock);
        $result = $user->register_user("", "test@example.com", "Password123!");

        $expectedErrors = ["username" => "Username cannot be empty."];
        $this->assertEquals(
            $expectedErrors,
            $result["register"]["errors"],
            "Username validation error message does not match."
        );
    }

    public function testPasswordLengthError()
    {
        $dbMock = $this->getMockBuilder(Database::class)
            ->disableOriginalConstructor()
            ->getMock();

        $user = new User($dbMock);
        $result = $user->register_user("testuser", "test@example.com", "Pass!");

        $expectedErrors = [
            "password" => "Password must be at least 8 characters long.",
        ];
        $this->assertEquals(
            $expectedErrors,
            $result["register"]["errors"],
            "Password length error message does not match."
        );
    }

    public function testPasswordSymbolError()
    {
        $dbMock = $this->getMockBuilder(Database::class)
            ->disableOriginalConstructor()
            ->getMock();

        $user = new User($dbMock);
        $result = $user->register_user(
            "testuser",
            "test@example.com",
            "Password123"
        );

        $expectedErrors = [
            "password" => "Password must contain at least one symbol.",
        ];
        $this->assertEquals(
            $expectedErrors,
            $result["register"]["errors"],
            "Password symbol error message does not match."
        );
    }
}