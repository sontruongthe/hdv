app.controller("ctrlstatistical", function ($scope, $http) {
  $scope.confirm = [];

  $scope.load_all = function () {
    $http
      .get(`http://localhost:8080/statistical/confirm`)
      .then((res) => {
        $scope.confirm = res.data;
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };
  $scope.load = function () {
    $http
      .get(`http://localhost:8080/statistical/confirms`)
      .then((res) => {
        $scope.confirms = res.data;
      })
      .catch((error) => {
        console.log("Error", error);
      });
  };
  $scope.xacnhan = function (orderid) {
    $http
      .get(`http://localhost:8080/statistical/confirm/${orderid}`)
      .then((resp) => {
        $scope.form = resp.data;
        var item = $scope.form;
        item.status = 2;
        console.log(item);

        $http
          .put(`http://localhost:8080/statistical/confirm/${orderid}`, item)
          .then((resp) => {
            Swal.fire("Hệ Thống", "Xác nhận đơn hàng thành công!!", "success");
            $http
              .post(`http://localhost:8080/send/orders`, item)
              .then((ressendOder) => {
                console.log(ressendOder);
              })
              .catch((error) => {
                console.log(error);
                alert("that bai");
              });
            $scope.load();
            $scope.load_all();
          })
          .catch((error) =>
            Swal.fire("Error", "Hình như là mình hết hàng rùi :(", "error")
          );
      })
      .catch((error) => console.log("Error", error));
  };
  $scope.huydon = function (orderid) {
    $http
      .get(`http://localhost:8080/statistical/confirm/${orderid}`)
      .then((resp) => {
        $scope.form = resp.data;
        var item = $scope.form;
        item.status = 3;
        console.log(item);

        $http
          .put(`http://localhost:8080/statistical/confirm/${orderid}`, item)
          .then((resp) => {
            Swal.fire("Hệ Thống", "Đơn Hàng đã được hủy!", "success");
            $http
              .post(`http://localhost:8080/send/orders`, item)
              .then((ressendOder) => {
                console.log(ressendOder);
              })
              .catch((error) => {
                console.log(error);
                alert("that bai");
              });
            $scope.load();
            $scope.load_all();
          })
          .catch((error) => Swal.fire("Error", "Xác nhận rùi mà :(", "error"));
      })
      .catch((error) => console.log("Error", error));
  };

  $scope.info = function (orderid) {
    $http
      .get(`http://localhost:8080/statistical/infoDetail/${orderid}`)
      .then((resp) => {
        $scope.items = resp.data;
      })
      .catch((error) => console.log("Error", error));
  };
  $scope.allfindSanPham = function () {
    $http
      .get(`http://localhost:8080/statistical/allSanPham`)
      .then((resp) => {
        $scope.allfindSanPham = resp.data;
      })
      .catch((error) => console.log("Error", error));
  };

  $scope.top5item = function () {
    $http
      .get(`http://localhost:8080/statistical/top5items`)
      .then((resp) => {
        $scope.top5item = resp.data;
        $scope.drawBarChart();
      })
      .catch((error) => console.log("Error", error));
  };
  $scope.drawBarChart = function () {
    // Lấy tên sản phẩm (labels) và số lượng bán (data)
    const labels = $scope.top5item.map((item) => item[0]); // Tên sản phẩm
    const data = $scope.top5item.map((item) => item[2]); // Số lượng bán
    const data1 = $scope.allfindSanPham.map((item) => item[3]); // Số tất cả sp lượng bán

    // Tính tổng số lượng bán
    const totalSales = data1.reduce((sum, current) => sum + current, 0);

    // Tính tỉ lệ phần trăm cho từng sản phẩm
    const percentageData = data.map((item) =>
      ((item / totalSales) * 100).toFixed(2)
    ); // Tính phần trăm và làm tròn đến 2 chữ số

    // Vẽ biểu đồ cột với tỉ lệ phần trăm
    const ctx = document.getElementById("barChart").getContext("2d");
    new Chart(ctx, {
      type: "bar", // Biểu đồ cột

      data: {
        labels: labels, // Trục X: tên sản phẩm

        datasets: [
          {
            label: "Tỉ lệ phần trăm sản phẩm đã bán",
            data: percentageData,
            backgroundColor: [
              "rgba(255, 99, 132, 0.2)",
              "rgba(255, 159, 64, 0.2)",
              "rgba(255, 205, 86, 0.2)",
              "rgba(75, 192, 192, 0.2)",
              "rgba(54, 162, 235, 0.2)",
              "rgba(153, 102, 255, 0.2)",
              "rgba(201, 203, 207, 0.2)",
            ],
            borderColor: [
              "rgb(255, 99, 132)",
              "rgb(255, 159, 64)",
              "rgb(255, 205, 86)",
              "rgb(75, 192, 192)",
              "rgb(54, 162, 235)",
              "rgb(153, 102, 255)",
              "rgb(201, 203, 207)",
            ],
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Sản phẩm",
            },
          },
          y: {
            title: {
              display: true,
              text: "Tỉ lệ phần trăm (%)",
            },
            beginAtZero: true,
            ticks: {
              max: 100, // Đặt giới hạn tối đa cho trục Y là 100%
            },
          },
        },
      },
    });
  };

  $scope.top5buyer = function () {
    $http
      .get(`http://localhost:8080/statistical/top5buyer`)
      .then((resp) => {
        $scope.top5buyer = resp.data;
      })
      .catch((error) => console.log("Error", error));
  };
  let turnoverChart = null; // Khai báo biến toàn cục để lưu biểu đồ

  $scope.drawTurnoverChart = function (data) {
    const ctx = document.getElementById("turnoverChart").getContext("2d");

    // Xử lý dữ liệu
    const labels = data.map((item) => item[0]); // Thời gian (ngày/tháng/năm)
    const turnoverData = data.map((item) => item[2]); // Tổng doanh thu
    const quantityData = data.map((item) => item[1]); // Số lượng đơn hàng

    // Nếu biểu đồ đã tồn tại, xoá nó trước khi vẽ mới
    if (turnoverChart) {
      turnoverChart.destroy();
    }

    // Vẽ biểu đồ mới
    turnoverChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: labels,
        datasets: [
          {
            label: "Doanh thu (VND)",
            data: turnoverData,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 2,
            yAxisID: "y", // Trục Y1
          },
          {
            label: "Số lượng đơn hàng",
            data: quantityData,
            borderColor: "rgba(255, 99, 132, 1)",
            backgroundColor: "rgba(255, 99, 132, 0.2)",
            borderWidth: 2,
            yAxisID: "y1", // Trục Y2
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "top",
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: "Thời gian",
            },
          },
          y: {
            title: {
              display: true,
              text: "Doanh thu (VND)",
            },
            beginAtZero: true,
            position: "left", // Trục Y1 nằm bên trái
          },
          y1: {
            title: {
              display: true,
              text: "Số lượng đơn hàng",
            },
            beginAtZero: true,
            position: "right", // Trục Y2 nằm bên phải
            grid: {
              drawOnChartArea: false, // Ngăn chặn lưới chồng lặp
            },
          },
        },
      },
    });
  };

  $scope.turnover = function () {
    $http
      .get(`http://localhost:8080/statistical/turnoverday`)
      .then((resp) => {
        $scope.itemTurnover = resp.data;
        $scope.drawTurnoverChart($scope.itemTurnover); // Vẽ biểu đồ
      })
      .catch((error) => console.log("Error", error));
  };

  $scope.turnovermonth = function () {
    $http
      .get(`http://localhost:8080/statistical/turnovermonth`)
      .then((resp) => {
        $scope.itemTurnover = resp.data;
        $scope.drawTurnoverChart($scope.itemTurnover); // Vẽ biểu đồ
      })
      .catch((error) => console.log("Error", error));
  };

  $scope.turnoveryear = function () {
    $http
      .get(`http://localhost:8080/statistical/turnoveryear`)
      .then((resp) => {
        $scope.itemTurnover = resp.data;
        $scope.drawTurnoverChart($scope.itemTurnover); // Vẽ biểu đồ
      })
      .catch((error) => console.log("Error", error));
  };

  $scope.itemTurnover = [];
  $scope.confirms = [];
  $scope.turnovers = {
    page: 0,
    size: 5,
    get items() {
      var start = this.page * this.size;
      return $scope.itemTurnover.slice(start, start + this.size);
    },
    get count() {
      return Math.ceil((1.0 * $scope.itemTurnover.length) / this.size);
    },
    first() {
      this.page = 0;
    },
    prev() {
      this.page--;
      if (this.page < 0) {
        this.last();
      }
    },
    next() {
      this.page++;
      if (this.page >= this.count) {
        this.first();
      }
    },
    last() {
      this.page = this.count - 1;
    },
  };
  $scope.listConfirm = {
    page: 0,
    size: 3,
    get items() {
      var start = this.page * this.size;
      return $scope.confirm.slice(start, start + this.size);
    },
    get count() {
      return Math.ceil((1.0 * $scope.confirm.length) / this.size);
    },
    first() {
      this.page = 0;
    },
    prev() {
      this.page--;
      if (this.page < 0) {
        this.last();
      }
    },
    next() {
      this.page++;
      if (this.page >= this.count) {
        this.first();
      }
    },
    last() {
      this.page = this.count - 1;
    },
  };

  $scope.Confirms = {
    page: 0,
    size: 5,
    get items() {
      var start = this.page * this.size;
      return $scope.confirms.slice(start, start + this.size);
    },
    get count() {
      return Math.ceil((1.0 * $scope.confirms.length) / this.size);
    },
    first() {
      this.page = 0;
    },
    prev() {
      this.page--;
      if (this.page < 0) {
        this.last();
      }
    },
    next() {
      this.page++;
      if (this.page >= this.count) {
        this.first();
      }
    },
    last() {
      this.page = this.count - 1;
    },
  };

  $scope.load_all();
  $scope.load();
  $scope.turnover();
  $scope.allfindSanPham();

  $scope.top5item();
  $scope.top5buyer();
});
