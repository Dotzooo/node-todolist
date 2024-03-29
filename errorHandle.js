function errorHandle(res, message = "欄位輸入錯誤")  {
  const HEADER = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };

  res.writeHead(400, HEADER);
  res.write(
    JSON.stringify({
      status: "error",
      message,
    })
  );
  res.end();
}

module.exports = errorHandle;
