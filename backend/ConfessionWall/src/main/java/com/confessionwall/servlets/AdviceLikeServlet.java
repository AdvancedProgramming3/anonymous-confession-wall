package com.example.advice;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/api/advice/like")
public class AdviceLikeServlet extends HttpServlet {

    private AdviceDao adviceDao = new AdviceDao();

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {

        resp.setContentType("application/json");

        String idStr = req.getParameter("id");

        if (idStr == null) {
            resp.setStatus(400);
            resp.getWriter().write("{\"error\":\"id is required\"}");
            return;
        }

        int id = Integer.parseInt(idStr);

        boolean ok = adviceDao.likeAdvice(id);

        if (ok) {
            resp.getWriter().write("{\"message\":\"liked\"}");
        } else {
            resp.setStatus(404);
            resp.getWriter().write("{\"error\":\"Advice not found\"}");
        }
    }
}
