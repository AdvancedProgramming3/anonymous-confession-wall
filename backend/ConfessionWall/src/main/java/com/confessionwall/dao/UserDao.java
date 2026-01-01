package com.confessionwall.dao;

import java.sql.*;
import com.confessionwall.model.UserModel;
import com.confessionwall.util.DBConnectionUtil;
import org.mindrot.jbcrypt.BCrypt;

public class UserDAO {

    public boolean registerUser(String username, String password) {
        String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
        String sql = "INSERT INTO users (username, password) VALUES (?, ?)";

        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {
            pstmt.setString(1, username);
            pstmt.setString(2, hashedPassword);
            return pstmt.executeUpdate() > 0;
        } catch (SQLException e) {
            e.printStackTrace();
            return false;
        }
    }

    public UserModel authenticate(String username, String password) {
        String sql = "SELECT * FROM users WHERE username = ?";
        try (Connection conn = DBConnectionUtil.getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, username);
            ResultSet rs = pstmt.executeQuery();

            if (rs.next()) {
                String storedHash = rs.getString("password");
                if (BCrypt.checkpw(password, storedHash)) {
                    return new UserModel(rs.getInt("id"), rs.getString("username"), null);
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
        return null;
    }
}