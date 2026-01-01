package com.confessionwall.model;

import java.sql.Timestamp;

public class AdviceModel {
    private int id;
    private String content;
    private int likes;
    private int userId;
    private Timestamp createdAt;

    public AdviceModel() {}

    public AdviceModel(String content, int userId) {
        this.content = content;
        this.userId = userId;
    }

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public int getUserId() { return userId; }
    public void setUserId(int userId) { this.userId = userId; }

    public Timestamp getCreatedAt() { return createdAt; }
    public void setCreatedAt(Timestamp createdAt) { this.createdAt = createdAt; }
}