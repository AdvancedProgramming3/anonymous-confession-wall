package com.example.advice;

public class Advice {
    private int id;
    private String content;
    private int likes;
    private String createdAt;

    public Advice(int id, String content, int likes, String createdAt) {
        this.id = id;
        this.content = content;
        this.likes = likes;
        this.createdAt = createdAt;
    }

    public int getId() { return id; }
    public String getContent() { return content; }
    public int getLikes() { return likes; }
    public String getCreatedAt() { return createdAt; }
}
