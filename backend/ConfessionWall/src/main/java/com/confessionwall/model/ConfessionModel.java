package com.confessionwall.model;

import java.sql.Timestamp;

public class ConfessionModel {
	private int id;
	private String content;
	private int likes;
	private int user_id;
	private Timestamp createdAt;
	
	public ConfessionModel() {};
	
	public ConfessionModel(String content, int user_id) {
		this.content = content;
		this.user_id = user_id;
	}
	
	public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }
    public int getUserId() { return user_id; }
    public void setUserId(int userId) { this.user_id = userId; }
    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}
