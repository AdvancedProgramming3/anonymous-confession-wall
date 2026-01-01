package com.confessionwall.servlets;

import com.confessionwall.dao.UserDAO;
import com.confessionwall.model.UserModel;
import javax.servlet.ServletException; // <--- MUST HAVE
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.*;
import java.io.IOException;

@WebServlet("/auth/login")
public class LoginServlet extends HttpServlet {
    private UserDAO userDAO = new UserDAO();

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException { // <--- ADD ServletException HERE

        String user = request.getParameter("username");
        String pass = request.getParameter("password");

        UserModel authenticatedUser = userDAO.authenticate(user, pass);

        if (authenticatedUser != null) {
            HttpSession session = request.getSession();
            session.setAttribute("userId", authenticatedUser.getId());
            session.setAttribute("username", authenticatedUser.getUsername());

            // Redirect back to home page so the UI updates to "Logged in"
            response.sendRedirect(request.getContextPath() + "/index.jsp");
        } else {
            // Send back to index with an error message
            response.sendRedirect(request.getContextPath() + "/index.jsp?error=invalid");
        }
    }
}