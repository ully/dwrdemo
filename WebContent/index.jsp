<%@ page language="java" contentType="text/html; charset=UTF-8" %>
<%
	String path = request.getContextPath();
	if(!path.endsWith("/")){
		path+="/";
	}
	String basePath = request.getScheme() + "://"+ request.getServerName() + ":" + request.getServerPort()+ path;
%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
<html>
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
  <title>developerWorks - Ajax with DWR</title>
  <link rel="stylesheet" type="text/css" href="style.css" media="screen"/>
    <script type='text/javascript' src='<%=basePath%>dwr/engine.js'></script>
  <script type='text/javascript' src='<%=basePath%>dwr/util.js'></script>
  <script type='text/javascript' src='<%=basePath%>dwr/interface/Catalogue.js'></script>
  <script type='text/javascript' src='<%=basePath%>dwr/interface/Cart.js'></script>
  <script type='text/javascript' src='<%=basePath%>shopping.js'></script>
</head>
<body>
<h1>Ajax Store using DWR</h1>
<form id="searchform">
  <input id="searchbox"/><button type="submit" id="searchbtn">Search</button>
</form>
<div id="cart">
  <h3>Your Shopping Cart</h3>
  <ul id="contents"></ul>
  Total price: <span id="totalprice"></span>
</div>
<div id="catalogue">
  <table>
  <thead>
  <tr><th>Name</th><th>Description</th><th>Price</th><th></th><!-- Add to Cart buttons --></tr>
  </thead>
  <tbody id="items">
  </tbody>
  </table>
</div>
</html>
