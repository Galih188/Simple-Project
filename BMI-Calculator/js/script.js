document.getElementById("bmiForm").addEventListener("submit", function (event) {
  event.preventDefault(); // Mencegah form refresh halaman

  let weight = parseFloat(document.getElementById("weight").value);
  let height = parseFloat(document.getElementById("height").value) / 100; // Konversi cm ke meter
  let gender = document.getElementById("gender").value;

  if (isNaN(weight) || isNaN(height) || height <= 0 || weight <= 0) {
    alert("Masukkan berat dan tinggi yang valid!");
    return;
  }

  let bmi = weight / (height * height);
  let category = "";

  if (bmi < 18.5) {
    category = "Kurus";
  } else if (bmi < 24.9) {
    category = "Normal";
  } else if (bmi < 29.9) {
    category = "Overweight";
  } else {
    category = "Obesitas";
  }

  document.getElementById("result").innerHTML = `
        <p>${gender}, BMI Anda: <strong>${bmi.toFixed(2)}</strong></p>
        <p>Kategori: <strong>${category}</strong></p>
    `;
});
