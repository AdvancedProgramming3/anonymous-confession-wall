package com.example.advice;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AdviceDao {

    public boolean createAdvice(String content, int userId) {
        String sql = "INSERT INTO advice(content, likes, user_id, created_at) VALUES (?, 0, ?, NOW())";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, content);
            ps.setInt(2, userId);

            return ps.executeUpdate() == 1;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public List<Advice> getAllAdvice() {
        List<Advice> list = new ArrayList<>();

        String sql = "SELECT id, content, likes, created_at FROM advice ORDER BY created_at DESC";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(new Advice(
                        rs.getInt("id"),
                        rs.getString("content"),
                        rs.getInt("likes"),
                        rs.getString("created_at")
                ));
            }

        } catch (Exception e) {
            e.printStackTrace();
        }

        return list;
    }

    public boolean likeAdvice(int id) {
        String sql = "UPDATE advice SET likes = likes + 1 WHERE id = ?";

        try (Connection conn = DB.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            return ps.executeUpdate() == 1;

        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }
}
