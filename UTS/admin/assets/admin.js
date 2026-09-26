$(function () {

// Who am I / logout

  $.get("/admin/auth/me", function (res) {
    if (res.loggedIn) $("#whoami").text("Halo, " + res.username);
  });

  $("#logoutBtn").on("click", function () {
    $.post("/admin/auth/logout", function (res) {
      window.location.href = res.redirect || "/admin/login";
    });
  });

// Load & render stores

  function loadStores() {
    $.get("/admin/api/stores")
      .done(renderRows)
      .fail(function (xhr) {
        if (xhr.status === 401) window.location.href = "/admin/login";
      });
  }

  function renderRows(stores) {
    var $body = $("#storeTableBody").empty();

    if (!stores.length) {
      $body.append('<tr><td colspan="6" style="color:#5B6B62;">Belum ada data toko.</td></tr>');
      return;
    }

    stores.forEach(function (s) {
      var statusClass = s.status === "Buka" ? "buka" : "tutup";
      var row = $(
        "<tr>" +
          "<td>" + escapeHtml(s.nama) + "</td>" +
          "<td>" + escapeHtml(s.alamat || "-") + "</td>" +
          "<td>" + escapeHtml(s.jam_buka || "-") + "</td>" +
          '<td><span class="status-tag ' + statusClass + '">' + escapeHtml(s.status) + "</span></td>" +
          "<td>" + (s.rating || 0) + "</td>" +
          '<td class="row-actions">' +
            '<button class="edit-btn" data-id="' + s.id + '">Edit</button>' +
            '<button class="delete-btn" data-id="' + s.id + '">Hapus</button>' +
          "</td>" +
        "</tr>"
      );
      row.data("store", s);
      $body.append(row);
    });
  }

  function escapeHtml(str) {
    return $("<div>").text(str == null ? "" : str).html();
  }

  loadStores();

// Modal open/close

  function openModal(mode, store) {
    $("#modalTitle").text(mode === "edit" ? "Edit Toko" : "Tambah Toko");
    $("#storeId").val(store ? store.id : "");
    $("#storeNama").val(store ? store.nama : "");
    $("#storeAlamat").val(store ? store.alamat : "");
    $("#storeJam").val(store ? store.jam_buka : "");
    $("#storeStatus").val(store ? store.status : "Buka");
    $("#storeRating").val(store ? store.rating : "");
    $("#storeModal").addClass("open");
  }

  function closeModal() {
    $("#storeModal").removeClass("open");
    $("#storeForm")[0].reset();
  }

  $("#newStoreBtn").on("click", function () { openModal("new", null); });
  $("#cancelModalBtn").on("click", closeModal);
  $("#storeModal").on("click", function (e) {
    if (e.target === this) closeModal();
  });

// Edit / delete

  $(document).on("click", ".edit-btn", function () {
    var store = $(this).closest("tr").data("store");
    openModal("edit", store);
  });

  $(document).on("click", ".delete-btn", function () {
    var id = $(this).data("id");
    if (!confirm("Hapus toko ini?")) return;

    $.ajax({ url: "/admin/api/stores/" + id, method: "DELETE" })
      .done(loadStores)
      .fail(function (xhr) {
        if (xhr.status === 401) window.location.href = "/admin/login";
        else alert("Gagal menghapus toko.");
      });
  });

// Create / update

  $("#storeForm").on("submit", function (e) {
    e.preventDefault();

    var id = $("#storeId").val();
    var payload = {
      nama: $("#storeNama").val().trim(),
      alamat: $("#storeAlamat").val().trim(),
      jam_buka: $("#storeJam").val().trim(),
      status: $("#storeStatus").val(),
      rating: parseFloat($("#storeRating").val()) || 0,
    };

    var req = id
      ? $.ajax({ url: "/admin/api/stores/" + id, method: "PUT", contentType: "application/json", data: JSON.stringify(payload) })
      : $.ajax({ url: "/admin/api/stores", method: "POST", contentType: "application/json", data: JSON.stringify(payload) });

    req
      .done(function () {
        closeModal();
        loadStores();
      })
      .fail(function (xhr) {
        if (xhr.status === 401) window.location.href = "/admin/login";
        else alert("Gagal menyimpan toko.");
      });
  });

});
