package com.confessionwall.servlets;

import com.confessionwall.dao.UserDAO;
import javax.servlet.ServletException; // <--- MUST HAVE
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/auth/register")
public class RegisterServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException { // <--- ADD ServletException HERE

        String user = request.getParameter("username");
        String pass = request.getParameter("password");

        if (userDAO.registerUser(user, pass)) {
            // After registering, go to index so they can login
            response.sendRedirect(request.getContextPath() + "/index.jsp?msg=registered");
        } else {
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=exists");
        }
    }
}