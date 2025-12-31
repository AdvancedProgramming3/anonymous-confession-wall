package com.example.advice;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;
import java.util.List;

@WebServlet("/api/advice/all")
public class AdviceListServlet extends HttpServlet {

    private AdviceDao adviceDao = new AdviceDao();

    @Override
    protected void doGet(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("application/json");

        List<Advice> list = adviceDao.getAllAdvice();

        StringBuilder json = new StringBuilder("[");
        for (int i = 0; i < list.size(); i++) {
            Advice a = list.get(i);

            json.append("{")
                .append("\"id\":").append(a.getId()).append(",")
                .append("\"content\":\"").append(a.getContent().replace("\"","\\\"")).append("\",")
                .append("\"likes\":").append(a.getLikes()).append(",")
                .append("\"createdAt\":\"").append(a.getCreatedAt()).append("\"")
                .append("}");

            if (i < list.size() - 1) json.append(",");
        }
        json.append("]");

        resp.getWriter().write(json.toString());
    }
}
