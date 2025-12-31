package com.example.advice;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class AdviceDAO {

    public void insert(String content) throws Exception {
        String sql = "INSERT INTO advice(content, likes, created_at) VALUES (?, 0, NOW())";

        try (Connection conn = DB.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setString(1, content);
            stmt.executeUpdate();
        }
    }

    public List<Advice> findAll() throws Exception {
        String sql = "SELECT id, content, likes, created_at FROM advice ORDER BY created_at DESC";
        List<Advice> list = new ArrayList<>();

        try (Connection conn = DB.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql);
             ResultSet rs = stmt.executeQuery()) {

            while (rs.next()) {
                Advice a = new Advice(
                        rs.getInt("id"),
                        rs.getString("content"),
                        rs.getInt("likes"),
                        rs.getTimestamp("created_at").toLocalDateTime()
                );
                list.add(a);
            }
        }

        return list;
    }

    public boolean like(int id) throws Exception {
        String sql = "UPDATE advice SET likes = likes + 1 WHERE id = ?";
        try (Connection conn = DB.getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {

            stmt.setInt(1, id);
            int changed = stmt.executeUpdate();
            return changed == 1;
        }
    }
}
