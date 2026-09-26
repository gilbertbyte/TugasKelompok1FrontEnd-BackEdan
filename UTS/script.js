$(function () {
  var tokoPopuler = [
    { nama: "Es Pisang Ijo Bu Ida", jam: "08.00 - 21.00", rating: "4.8", buka: true },
    { nama: "Pisang Ijo Daeng Sija", jam: "09.00 - 20.00", rating: "4.6", buka: true },
    { nama: "Pisang Ijo Ratu Rasa", jam: "10.00 - 18.00", rating: "4.5", buka: false }
  ];

  var menuUnggulan = [
    { nama: "Pisang Ijo Original", desc: "Saus santan, bubur sumsum", harga: "Rp 15.000" },
    { nama: "Pisang Ijo Cokelat", desc: "Topping cokelat leleh", harga: "Rp 17.000" },
    { nama: "Pisang Ijo Durian", desc: "Dengan durian asli", harga: "Rp 20.000" },
    { nama: "Pisang Ijo Keju", desc: "Taburan keju parut", harga: "Rp 18.000" }
  ];

  var testimoni = [
    { nama: "Rangga", ulasan: "Porem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.", waktu: "2 hari yang lalu" },
    { nama: "Salsabila", ulasan: "Porem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.", waktu: "5 hari yang lalu" },
    { nama: "Fajar", ulasan: "Porem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate libero et velit interdum, ac aliquet odio mattis.", waktu: "1 minggu yang lalu" }
  ];

  var tokoHasil = [
    { nama: "Es Pisang Ijo Bu Ida", alamat: "Jl. Pengayoman, Makassar", jarak: "1.2 km", buka: true, jam: "08.00 - 21.00", rating: "4.8", ulasan: 128 },
    { nama: "Pisang Ijo Daeng Sija", alamat: "Jl. Boulevard, Makassar", jarak: "2.4 km", buka: true, jam: "09.00 - 20.00", rating: "4.6", ulasan: 96 },
    { nama: "Pisang Ijo Ratu Rasa", alamat: "Jl. Sultan Alauddin, Makassar", jarak: "3.1 km", buka: false, jam: "10.00 - 18.00", rating: "4.5", ulasan: 54 }
  ];

  

  function renderTokoPopuler() {
    var $grid = $("#tokoPopulerGrid").empty();
    tokoPopuler.forEach(function (t) {
      var statusClass = t.buka ? "status-open" : "status-closed";
      var statusText = t.buka ? "Buka sekarang" : "Tutup";
      var card = $(
        '<div class="store-card">' +
          '<div class="card-media">Ceritanya gambar lokasi</div>' +
          '<div class="card-body">' +
            '<h3>' + t.nama + '</h3>' +
            '<p class="meta">Jam Buka: ' + t.jam + '</p>' +
            '<p class="' + statusClass + '">' + statusText + '</p>' +
            '<span class="rating">★ ' + t.rating + '</span>' +
          '</div>' +
        '</div>'
      );
      $grid.append(card);
    });
  }

  function renderMenu(list) {
    var $grid = $("#menuGrid").empty();
    list.forEach(function (m) {
      var card = $(
        '<div class="menu-card">' +
          '<div class="card-media">Ceritanya gambar Menu</div>' +
          '<div class="card-body">' +
            '<h3>' + m.nama + '</h3>' +
            '<p class="desc">' + m.desc + '</p>' +
            '<span class="price">' + m.harga + '</span>' +
            '<button class="add-btn" title="Tambah ke keranjang">+</button>' +
          '</div>' +
        '</div>'
      );
      $grid.append(card);
    });
  }

  function renderTestimoni() {
    var $grid = $("#testimoniGrid").empty();
    testimoni.forEach(function (t) {
      var card = $(
        '<div class="testi-card">' +
          '<div class="stars">★★★★★</div>' +
          '<div class="name">' + t.nama + '</div>' +
          '<p>' + t.ulasan + '</p>' +
          '<div class="when">' + t.waktu + '</div>' +
        '</div>'
      );
      $grid.append(card);
    });
  }

  var TOKO_HASIL_LIMIT = 4;
  var tokoHasilFiltered = tokoHasil;
  var tokoHasilVisible = TOKO_HASIL_LIMIT;

  function renderTokoHasil(list) {
    tokoHasilFiltered = list;
    tokoHasilVisible = TOKO_HASIL_LIMIT;
    renderTokoHasilPage();
  }

  function renderTokoHasilPage() {
    var $grid = $("#tokoHasilGrid").empty();
    var visibleList = tokoHasilFiltered.slice(0, tokoHasilVisible);

    visibleList.forEach(function (t) {
      var statusClass = t.buka ? "status-open" : "status-closed";
      var statusText = t.buka ? "Buka" : "Tutup";
      var card = $(
        '<div class="store-card">' +
          '<div class="card-body">' +
            '<h3>' + t.nama + '</h3>' +
            '<p class="meta">' + t.alamat + '</p>' +
            '<p class="meta">Jarak: ' + t.jarak + '</p>' +
            '<p class="' + statusClass + '">' + statusText + ' &middot; ' + t.jam + '</p>' +
            '<span class="rating">★ ' + t.rating + ' (' + t.ulasan + ' ulasan)</span><br>' +
            '<a href="#" class="link-arrow" style="margin-top:10px;display:inline-block;">Lihat Detail</a>' +
          '</div>' +
        '</div>'
      );
      $grid.append(card);
    });

    $("#resultsCount").text(tokoHasilFiltered.length);
    $("#showMoreBtn").toggle(tokoHasilVisible < tokoHasilFiltered.length);
  }

  renderTokoPopuler();
  renderMenu(menuUnggulan);
  renderTestimoni();
  renderTokoHasil(tokoHasil);

  

  function applyFilter() {
    var nama = $("#filterNama").val().trim().toLowerCase();
    var kota = $("#filterKota").val().trim().toLowerCase();
    var status = $("#filterStatus").val();
    var sort = $("#filterSort").val();

    var filtered = tokoHasil.filter(function (t) {
      var matchNama = !nama || t.nama.toLowerCase().indexOf(nama) !== -1;
      var matchKota = !kota || t.alamat.toLowerCase().indexOf(kota) !== -1;
      var matchStatus =
        status === "Semua Status" ||
        (status === "Buka" && t.buka) ||
        (status === "Tutup" && !t.buka);
      return matchNama && matchKota && matchStatus;
    });

    if (sort === "Rating Tertinggi") {
      filtered.sort(function (a, b) { return b.rating - a.rating; });
    } else if (sort === "Jarak Terdekat") {
      filtered.sort(function (a, b) { return parseFloat(a.jarak) - parseFloat(b.jarak); });
    } else if (sort === "Nama A-Z") {
      filtered.sort(function (a, b) { return a.nama.localeCompare(b.nama); });
    }

    renderTokoHasil(filtered);
  }

  $("#filterForm").on("submit", function (e) {
    e.preventDefault();
    applyFilter();
  });

  

  $(document).on("click", "#showMoreBtn", function () {
    tokoHasilVisible = tokoHasilFiltered.length;
    renderTokoHasilPage();
  });

  

  $(document).on("click", ".add-btn", function () {
    var $btn = $(this);
    $btn.text("✓");
    setTimeout(function () { $btn.text("+"); }, 900);
  });

  

  $(".accordion-trigger").on("click", function () {
    var $item = $(this).closest(".accordion-item");
    var $panel = $item.find(".accordion-panel");
    var isOpen = $item.hasClass("open");

    $(".accordion-item").removeClass("open").find(".accordion-panel").css("max-height", 0);

    if (!isOpen) {
      $item.addClass("open");
      $panel.css("max-height", $panel.prop("scrollHeight") + "px");
    }
  });

  

  $("#loginBtn").on("click", function () {
    alert("Demo: form Login / Sign In akan tampil di sini.");
  });

  $("#tulisUlasanBtn").on("click", function () {
    alert("Demo: form Tulis Ulasan akan tampil di sini.");
  });

});