package com.confessionwall.dao;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;


import com.confessionwall.model.AdviceModel;
import com.confessionwall.util.DBConnectionUtil; 

public class AdviceDAO {

   
	public void addAdvice(AdviceModel advice) {
	    String sql = "INSERT INTO advice (content, likes, user_id, confession_id) VALUES (?, 0, ?, ?)";
	    try (Connection conn = DBConnectionUtil.getConnection();
	         PreparedStatement ps = conn.prepareStatement(sql)) {
	        
	        ps.setString(1, advice.getContent());
	        ps.setInt(2, advice.getUserId());
	        ps.setInt(3, advice.getConfessionId()); 
	        ps.executeUpdate();
	    } catch (SQLException e) {
	        e.printStackTrace();
	    }
	}

    public List<AdviceModel> getAllAdvice() {
        List<AdviceModel> list = new ArrayList<>();
        String sql = "SELECT * FROM advice ORDER BY created_at DESC";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                AdviceModel advice = new AdviceModel();
                advice.setId(rs.getInt("id"));
                advice.setContent(rs.getString("content"));
                advice.setLikes(rs.getInt("likes"));
                advice.setUserId(rs.getInt("user_id"));
                advice.setCreatedAt(rs.getTimestamp("created_at"));
                
                list.add(advice);
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return list;
    }

    public void incrementLikes(int id) {
        String sql = "UPDATE advice SET likes = likes + 1 WHERE id = ?";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public void decrementLikes(int id) {
        String sql = "UPDATE advice SET likes = likes - 1 WHERE id = ? AND likes > 0";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, id);
            ps.executeUpdate();
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
    public List<AdviceModel> getAdviceByConfessionId(int confessionId) {
        List<AdviceModel> list = new ArrayList<>();
        String sql = "SELECT * FROM advice WHERE confession_id = ? ORDER BY created_at ASC";
        
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            
            ps.setInt(1, confessionId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    AdviceModel advice = new AdviceModel();

                    advice.setId(rs.getInt("id"));
                    advice.setContent(rs.getString("content"));
                    advice.setLikes(rs.getInt("likes"));
                    advice.setUserId(rs.getInt("user_id"));
                    advice.setCreatedAt(rs.getTimestamp("created_at"));

                    advice.setConfessionId(rs.getInt("confession_id"));
                    
                    list.add(advice);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return list;
    }
}