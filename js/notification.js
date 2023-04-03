// Set the data for fake sales notifications
const salesData = [
  { city: "嘉義市", name: "陳小姐", time: "2分鐘前", product: "泡茶杯" },
  { city: "高雄市", name: "林先生", time: "1分鐘前", product: "泡茶杯" },
  { city: "苗栗縣", name: "許小姐", time: "5分鐘前", product: "泡茶杯" },
  { city: "彰化縣", name: "林小姐", time: "12分鐘前", product: "泡茶杯" },
  { city: "台南市", name: "吳先生", time: "20分鐘前", product: "泡茶杯" },
  { city: "花蓮縣", name: "黃小姐", time: "3分鐘前", product: "泡茶杯" },
  { city: "新北市", name: "張先生", time: "8分鐘前", product: "泡茶杯" }
];

// Define the function to display the sales notifications
function displaySalesNotification() {
  const notification = document.querySelector(".sales-notification");
  // Select a random sales data
  const randomIndex = Math.floor(Math.random() * salesData.length);
  const randomSale = salesData[randomIndex];
  // Create the notification element
  const notificationElement = document.createElement("p");
  notificationElement.innerHTML = `
    <span class="emo">&#x1F514;</span>
    <span class="city">${randomSale.city}</span>
    <span class="name">${randomSale.name}</span>
    <span class="time">${randomSale.time}</span>
    前購買了
    <span class="product">${randomSale.product}</span>
  `;
  // Add the notification element to the notification container
  notification.appendChild(notificationElement);
  // Remove the oldest notification if there are more than 1 notifications
  if (notification.children.length > 1) {
    notification.removeChild(notification.children[0]);
  }
  // Set the next notification display time
  const nextDisplayTime = Math.floor(Math.random() * (30000 - 10000 + 1)) + 10000; // Random time between 1s to 30s
  setTimeout(displaySalesNotification, nextDisplayTime);
}

// Call the function to display the sales notifications
displaySalesNotification();
