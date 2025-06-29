<?php
class RequestModel
{
    public static function create($pdo, $data)
    {
        $stmt = $pdo->prepare('INSERT INTO requests (user_id, target_ip, website_name, description, justification) VALUES (?, ?, ?, ?, ?)');
        return $stmt->execute([
            $data['user_id'],
            $data['target_ip'],
            $data['website_name'],
            $data['description'],
            $data['justification']
        ]);
    }
    public static function findByUser($pdo, $user_id)
    {
        $stmt = $pdo->prepare('SELECT * FROM requests WHERE user_id = ? ORDER BY created_at DESC');
        $stmt->execute([$user_id]);
        return $stmt->fetchAll();
    }
    public static function findAll($pdo)
    {
        $stmt = $pdo->query('SELECT * FROM requests ORDER BY created_at DESC');
        return $stmt->fetchAll();
    }
    public static function findById($pdo, $id)
    {
        $stmt = $pdo->prepare('SELECT * FROM requests WHERE id = ?');
        $stmt->execute([$id]);
        return $stmt->fetch();
    }
    public static function updateStatus($pdo, $id, $status, $admin_comment = null)
    {
        $stmt = $pdo->prepare('UPDATE requests SET status = ?, admin_comment = ?, updated_at = NOW() WHERE id = ?');
        return $stmt->execute([$status, $admin_comment, $id]);
    }
}
