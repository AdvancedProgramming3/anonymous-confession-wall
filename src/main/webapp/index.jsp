<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c" %>
<!DOCTYPE html>
<html>
<head>
    <title>Anonymous Confession Wall</title>
    <style>
        body { font-family: sans-serif; background: #f4f4f9; padding: 20px; max-width: 800px; margin: auto; }
        .card { background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
        .user { font-weight: bold; color: #555; }
        .auth-box { background: #eee; padding: 15px; border-radius: 8px; margin-bottom: 20px; }
        input, textarea { width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box; }
        button { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; }
    </style>
</head>
<body>

<h1>Confession Wall</h1>

<div class="auth-box">
    <c:choose>
        <%-- Check if user is NOT logged in --%>
        <c:when test="${empty sessionScope.username}">
            <h3>Login or Register</h3>
            <form action="${pageContext.request.contextPath}/auth/login" method="post">
                <input type="text" name="username" placeholder="Username" required>
                <input type="password" name="password" placeholder="Password" required>
                <button type="submit">Login</button>
                <button type="submit" formaction="${pageContext.request.contextPath}/auth/register">Register</button>
            </form>
        </c:when>

        <%-- Check if user IS logged in --%>
        <c:otherwise>
            <p>Logged in as: <strong>${sessionScope.username}</strong></p>

            <form action="${pageContext.request.contextPath}/" method="post">
                <textarea name="content" placeholder="Share your secret..." required></textarea>
                <button type="submit">Post Confession</button>
            </form>

            <form action="${pageContext.request.contextPath}/auth/logout" method="post" style="margin-top:10px;">
                <button type="submit" style="background:#dc3545;">Logout</button>
            </form>
        </c:otherwise>
    </c:choose>
</div>

<hr>

<c:forEach items="${allConfessions}" var="c">
    <div class="card">
        <p>${c.content}</p>
        <small class="user">Posted by User ID: ${c.userId}</small>
        <br>
        <small>Likes: ${c.likes}</small>
    </div>
</c:forEach>

</body>
</html>