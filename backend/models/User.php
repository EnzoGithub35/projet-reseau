<?php
class User
{
    public static function findByUsername($pdo, $username)
    {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE username = ?');
        $stmt->execute([$username]);
        return $stmt->fetch();
    }
    public static function findByEmail($pdo, $email)
    {
        $stmt = $pdo->prepare('SELECT * FROM users WHERE email = ?');
        $stmt->execute([$email]);
        return $stmt->fetch();
    }
    public static function create($pdo, $data)
    {
        $stmt = $pdo->prepare('INSERT INTO users (username, password, fullname, email, role) VALUES (?, ?, ?, ?, ?)');
        return $stmt->execute([
            $data['username'],
            $data['password'],
            $data['fullname'],
            $data['email'],
            $data['role'] ?? 'demandeur'
        ]);
    }
}
