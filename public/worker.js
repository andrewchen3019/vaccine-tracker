  
console.log("Service Worker Loaded...");

self.addEventListener("push", e => {
  const data = e.data.json();
  console.log("Push Recieved...");
  self.registration.showNotification(data.title, {
    body: "New Vaccine Appointment Available!",
    icon: "https://p.kindpng.com/picc/s/192-1925255_png-transparent-download-new-vaccine-regulations-will-transparent.png"
  });
}); 