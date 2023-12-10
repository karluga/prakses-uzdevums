<?php
class User {
    private $conn;
    private $table_users = 'accounts';

    public function __construct($db){
        $this->conn = $db;
    }

    // Check if the email already exists in the database
    private function emailExists($email) {
        $query = 'SELECT id FROM ' . $this->table_users . ' WHERE email = :email LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':email', $email);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Check if the username already exists in the database
    private function usernameExists($username) {
        $query = 'SELECT id FROM ' . $this->table_users . ' WHERE username = :username LIMIT 1';
        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(':username', $username);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    // Create a new user in the database
    public function register_user($username, $email, $password) {

        
        $errors = [];
    
        // Validate email
        if (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email address.';
        }
    
        // Validate username
        if (empty($username)) {
            $errors['username'] = 'Username cannot be empty.';
        }
        // Validate pwd
        if (empty($password)) {
            $errors['password'] = 'Username cannot be empty.';
        }

        // If there are validation errors, return the array of error messages
        if (!empty($errors)) {
            return ['register' => ['errors' => $errors]];
        }

        // Check if email or username already exists
        if ($this->usernameExists($username)) {
            $errors['username'] = 'Username already exists.';
        }
        if ($this->emailExists($email)) {
            $errors['email'] = 'Email already exists.';
        }
        // If there are validation errors, return the array of error messages
        if (!empty($errors)) {
            return ['register' => ['errors' => $errors]];
        }
        // Hash the password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Insert the new user into the database
        $query = 'INSERT INTO ' . $this->table_users . ' (username, email, password) VALUES (:username, :email, :password)';
        $stmt = $this->conn->prepare($query);

        // Bind parameters
        $stmt->bindParam(':username', $username);
        
        // Check if email is provided
        if (!empty($email)) {
            $stmt->bindParam(':email', $email);
        } else {
            // If email is not provided, bind it as null in the query
            $stmt->bindValue(':email', null, PDO::PARAM_NULL);
        }

        $stmt->bindParam(':password', $hashedPassword);

        // Execute the query
        if ($stmt->execute()) {
            // Fetch the last inserted ID
            $lastInsertId = $this->conn->lastInsertId();

            // Return the user data in the specified format
            return [
                'user' => [
                    'id' => $lastInsertId,
                    'username' => $username,
                ]
            ];
        } else {
            return ['register' => ['errors' => ['message' => 'Error creating user.']]];
        }
    }
    public function check_user($input, $password) {
        $errors = [];
    
        if (filter_var($input, FILTER_VALIDATE_EMAIL)) {
            $email = $input;
            $username = null;
            $field = 'email';
        } else {
            $email = null;
            $username = $input;
            $field = 'username';
        }
    
        // Validate password
        if (empty($password)) {
            $errors['password'] = 'Password is required';
        }
    
        // Validate email or username
        if (empty($email) && empty($username)) {
            $errors['username'] = 'Username or email cannot be empty.';
        } elseif (!empty($email) && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $errors['email'] = 'Invalid email address.';
        }
    
        // Validate username
        // ...
    
        // If there are validation errors, return the array of error messages
        if (!empty($errors)) {
            return ['login' => ['errors' => $errors]];
        }
        
        // Use $this->conn to query the database
        $query = "SELECT id, username, email, password FROM {$this->table_users} WHERE $field = :input";
        $stmt = $this->conn->prepare($query);

        // Store the value in a variable
        $inputValue = ($field === 'email') ? $email : $username;

        // Bind the variable by reference
        $stmt->bindParam(':input', $inputValue);

        $stmt->execute();
        $userData = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($userData && password_verify($password, $userData['password'])) {
            return [
                'user' => [
                    'id' => $userData['id'],
                    'username' => $userData['username'],
                ]
            ];
        } else {
            $errors['password'] = 'The username or password is incorrect!';
            return ['login' => ['errors' => $errors]];
        }

    }
    
}
?>