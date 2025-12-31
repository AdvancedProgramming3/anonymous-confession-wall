package com.confessionwall.dao;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import com.confessionwall.model.ConfessionModel;
import com.confessionwall.util.DBConnectionUtil;

public class ConfessionDAO {
	
	public List<ConfessionModel> getAllConfession() {
		List<ConfessionModel> confessions = new ArrayList<>();
		
		String selectQuery = "SELECT * FROM confessions ORDER BY created_at DESC";
		
		try( Connection connection = DBConnectionUtil.getConnection();
				Statement statement = connection.createStatement();
				ResultSet results = statement.executeQuery(selectQuery);) {
			while(results.next()) {
				ConfessionModel confession = new ConfessionModel();
				confession.setId(results.getInt("id"));
				confession.setContent(results.getString("content"));
				confession.setLikes(results.getInt("likes"));
				confession.setUserId(results.getInt("user_id"));
				confession.setCreatedAt(results.getTimestamp("created_at"));
				
				confessions.add(confession);
			}
		} catch(SQLException e) {
			e.printStackTrace();
		}
		
		return confessions;
	}
	
	public void addConfession(ConfessionModel confession) {
		String insertQuery = "INSERT INTO confessions (content, user_id) VALUES (?, ?)";
		
		try (Connection connection = DBConnectionUtil.getConnection();
				PreparedStatement preparedStatement = connection.prepareStatement(insertQuery)){
			preparedStatement.setString(1, confession.getContent());
			preparedStatement.setInt(2, confession.getUserId());
			
			preparedStatement.executeUpdate();
			
		} catch(SQLException e) {
			e.printStackTrace();
		}
	}
}
