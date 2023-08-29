// Function to update and store all data in local storage
function updateLocalStorage() {
  //const selectedDate = document.querySelector('.selectedDate').textContent;
 // localStorage.setItem('selectedDate', selectedDate);

  //const selectedTimes = document.querySelector('.selectedTimes').textContent;
  //localStorage.setItem('selectedTimes', selectedTimes);

  /* const peakTimesCount = document.querySelector('.peakTime').textContent;
  localStorage.setItem('peakTimesCount', peakTimesCount);

  const nonPeakTimesCount = document.querySelector('.nonPeakTime').textContent;
  localStorage.setItem('nonPeakTimesCount', nonPeakTimesCount);

  const selectedTimesCount = document.querySelector('.selectedTimesCount').textContent;
  localStorage.setItem('selectedTimesCount', selectedTimesCount); */

  /* const localAdultCount = document.querySelector('.localAdult .count-cell').textContent;
  localStorage.setItem('localAdultCount', localAdultCount);

  const localChildCount = document.querySelector('.localChild .count-cell').textContent;
  localStorage.setItem('localChildCount', localChildCount);

  const localInfantCount = document.querySelector('.localInfant .count-cell').textContent;
  localStorage.setItem('localInfantCount', localInfantCount);

  const foreignAdultCount = document.querySelector('.foreignAdult .count-cell').textContent;
  localStorage.setItem('foreignAdultCount', foreignAdultCount);

  const foreignChildCount = document.querySelector('.foreignChild .count-cell').textContent;
  localStorage.setItem('foreignChildCount', foreignChildCount);

  const foreignInfantCount = document.querySelector('.foreignInfant .count-cell').textContent;
  localStorage.setItem('foreignInfantCount', foreignInfantCount); 

   const slAdultPrice = document.querySelector('.localAdult .price-cell').textContent;
  localStorage.setItem('slAdultPrice', slAdultPrice);

  const slChildPrice = document.querySelector('.localChild .price-cell').textContent;
  localStorage.setItem('slChildPrice', slChildPrice);

  const foreignAdultPrice = document.querySelector('.foreignAdult .price-cell').textContent;
  localStorage.setItem('foreignAdultPrice', foreignAdultPrice);

  const foreignChildPrice = document.querySelector('.foreignChild .price-cell').textContent;
  localStorage.setItem('foreignChildPrice', foreignChildPrice);

  const totalPrice = document.querySelector('.total-price-cell').textContent;
  localStorage.setItem('totalPrice', totalPrice); */


} 

const isFirstLoad = sessionStorage.getItem('reloadFlag') !== 'true';


if (isFirstLoad) {
    localStorage.clear();
    sessionStorage.setItem('reloadFlag', 'true');

}

//picking dates form flatpickr
  flatpickr("input[type=date-pick]", {
    dateFormat: "Y-m-d",
    onChange: function(selectedDates, dateStr, instance) {
        console.log(dateStr);
    }
    
  });

 
    flatpickr(".date-control", {
      dateFormat: "Y-m-d",
      position: "below", 
      onChange: (selectedDates, dateStr) => {
        this.selectedDate = dateStr;
      },
    });

  //outputting date in summary table
const dateSelection = document.querySelector('.date-control');

flatpickr(dateSelection, {
  minDate: "today",
  enableTime: false,
  dateFormat: 'Y-m-d',
  onChange: function(selectedDates, dateStr, instance) {
    updateSelectedDate(dateStr);
  }
});

function updateSelectedDate(dateStr) {
  const selectedDateDiv = document.querySelector('.selectedDate');
  selectedDateDiv.textContent = 'Selected Date: ' + dateStr;
  
   //Store selected date in local storage
  localStorage.setItem('selectedDate', dateStr);
}
updateLocalStorage()
// display stored data
document.addEventListener('DOMContentLoaded', function() {
  const storedDate = localStorage.getItem('selectedDate');
  if (storedDate) {
    updateSelectedDate(storedDate);
  }
});




    //code for selecting multiple times, getting hold of the peak hours
    //and non peak hours to calculating the total price

    document.addEventListener('DOMContentLoaded', function() {
      const timeSelection = document.querySelector('#timeDropdown');
      const selectedTimesDiv = document.querySelector('.selectedTimes');
      const peakTimesCountDiv = document.querySelector('.peakTime');
      const nonPeakTimesCountDiv = document.querySelector('.nonPeakTime');
      const selectedTimesCountDiv = document.querySelector('.selectedTimesCount');
      timeSelection.addEventListener('change', updateSelectedTimesAndCounts);
      loadStoredTimes();
    
      function updateSelectedTimesAndCounts() {
        const selectedOptions = timeSelection.selectedOptions;
        const selectedTimes = Array.from(selectedOptions).map(option => option.value);
        selectedTimesDiv.textContent = 'Selected Times: ' + selectedTimes.join(', ');
    
        const peakTimes = selectedTimes.filter(time => isPeakTime(time));
        const nonPeakTimes = selectedTimes.filter(time => !isPeakTime(time));
    
        peakTimesCountDiv.textContent = 'peak times count' + peakTimes.length;
        nonPeakTimesCountDiv.textContent = 'Non-Peak Times Count: ' + nonPeakTimes.length;
        const selectedTimesCountAdd = peakTimes.length + nonPeakTimes.length;
        //console.log(selectedTimesCountAdd);

        selectedTimesCountDiv.textContent =  selectedTimesCountAdd + ' hours'	;
        // Store data in local storage
        localStorage.setItem('selectedTimesCountAdd', selectedTimesCountAdd)
        localStorage.setItem('selectedTimes', JSON.stringify(selectedTimes));
        localStorage.setItem('peakTimesCount', peakTimes.length);
        localStorage.setItem('nonPeakTimesCount', nonPeakTimes.length);
      }

      function loadStoredTimes() {
        const storedTimesJSON = localStorage.getItem('selectedTimes');
        if (storedTimesJSON) {
          const storedTimes = JSON.parse(storedTimesJSON);
          timeSelection.querySelectorAll('option').forEach(option => {
            option.selected = storedTimes.includes(option.value);
          });
          updateSelectedTimesAndCounts();
        }
      }
      function isPeakTime(time) {
        const peakHours = ['10:00am - 11:00am', '11:00am - 12:00pm', '12:00pm - 01:00pm', '03:00pm - 04:00pm', '04:00pm - 05:00pm', '05:00pm - 06:00pm'];
        return peakHours.includes(time);
      }
    });
    




document.addEventListener('DOMContentLoaded', () => {
  const addButtons = document.querySelectorAll('.add-button');
  const subtractButtons = document.querySelectorAll('.subtract-button');
  const countCells = document.querySelectorAll('.count-cell');
  const priceCells = document.querySelectorAll('.price-cell');

  const prices = {
    localAdult: { peak: 6, normal: 4 },
    localChild: { peak: 3, normal: 2 },
    localInfant: { peak: 0, normal: 0 },
    foreignAdult: { peak: 13, normal: 10 },
    foreignChild: { peak: 8, normal: 5 },
    foreignInfant: { peak: 0, normal: 0 }
    // Add similar price data for other ticket types
  };

  // Add button event listeners to update counts
  addButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      updateCount(index, 1);
    });
  });

  subtractButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
      updateCount(index, -1);
    });
  });


  // Store count in local storage

  function updateLocalStorageValues() {
    const localAdultCount = document.querySelector('.localAdult .count-cell').textContent;
    localStorage.setItem('localAdultCount', localAdultCount);
  
    const localChildCount = document.querySelector('.localChild .count-cell').textContent;
    localStorage.setItem('localChildCount', localChildCount);
  
    const localInfantCount = document.querySelector('.localInfant .count-cell').textContent;
    localStorage.setItem('localInfantCount', localInfantCount);
  
    const foreignAdultCount = document.querySelector('.foreignAdult .count-cell').textContent;
    localStorage.setItem('foreignAdultCount', foreignAdultCount);
  
    const foreignChildCount = document.querySelector('.foreignChild .count-cell').textContent;
    localStorage.setItem('foreignChildCount', foreignChildCount);
  
    const foreignInfantCount = document.querySelector('.foreignInfant .count-cell').textContent;
    localStorage.setItem('foreignInfantCount', foreignInfantCount);
  }
  

  // Update count and calculate price
  function updateCount(index, change) {
    const currentCount = parseInt(countCells[index].textContent);
    const newCount = Math.max(currentCount + change, 0);
    countCells[index].textContent = newCount;
    updateLocalStorageValues(); // Add this line to update local storage
    updatePrice(index);
  }



  // Update price based on ticket type and counts
  function updatePrice(index) {
    const type = countCells[index].parentElement.getAttribute('data-type');
    const currentCount = parseInt(countCells[index].textContent);
    const selectedTimes = JSON.parse(localStorage.getItem('selectedTimes'));

    const peakHour = ['10:00am - 11:00am', '11:00am - 12:00pm', '12:00pm - 01:00pm', '03:00pm - 04:00pm', '04:00pm - 05:00pm', '05:00pm - 06:00pm'];
    const nonPeakHours = selectedTimes.filter(time => !peakHour.includes(time)).length;
    const peakHours = selectedTimes.filter(time => peakHour.includes(time)).length;

    const priceNorm = (currentCount * nonPeakHours * prices[type].normal);
    const pricePeak = (currentCount * peakHours * prices[type].peak);
    priceCells[index].textContent = pricePeak + priceNorm;
    updateAllPrices(); // Call the function to update all prices

// Update local storage here after the price changes
localStorage.setItem(type + 'Price', pricePeak + priceNorm);

   // localStorage.setItem(priceCells[index].textContent, pricePeak, priceNorm);
  }
  //console.log(priceCells);

  // Update prices for all ticket types
  function updateAllPrices() {
    let total = 0;
    priceCells.forEach(cell => {
      total += parseFloat(cell.textContent);
    });

    document.querySelector('.total-price-cell').textContent = total.toFixed(2);
    localStorage.setItem('totalPrice', total.toFixed(2)); // Update total price in local storage
 
  }

  // Call updateAllPrices when the page loads to display the initial prices
  updateAllPrices();


  //updateLocalStorage()

 const slAdultPrice = document.querySelector('.localAdult .price-cell').textContent;
  localStorage.setItem('slAdultPrice', slAdultPrice);

  const slChildPrice = document.querySelector('.localChild .price-cell').textContent;
  localStorage.setItem('slChildPrice', slChildPrice);

  const foreignAdultPrice = document.querySelector('.foreignAdult .price-cell').textContent;
  localStorage.setItem('foreignAdultPrice', foreignAdultPrice);

  const foreignChildPrice = document.querySelector('.foreignChild .price-cell').textContent;
  localStorage.setItem('foreignChildPrice', foreignChildPrice);

  const totalPrice = document.querySelector('.total-price-cell').textContent;
  localStorage.setItem('totalPrice', totalPrice);


});


































































/* 
function calTicketPrice(peakPrice, normalPrice, count, selectedSlots) {
  let totalPrice = 0;
  
  for (let i = 0; i < selectedSlots.length; i++) {
      let unitPrice = selectedSlots[i].classList.contains('highlight-peak') ? peakPrice : normalPrice;
      totalPrice += unitPrice * count;
  }
  
  return totalPrice;
}

function updateTotalPrice() {
  const selectedSlots = document.querySelectorAll('.selectedTimes .highlight-peak');
  
  const localAdultCount = parseInt(document.querySelector('.localAdult .count-cell').textContent);
  const localChildCount = parseInt(document.querySelector('.localChild .count-cell').textContent);
  const foreignAdultCount = parseInt(document.querySelector('.foreignAdult .count-cell').textContent);
  const foreignChildCount = parseInt(document.querySelector('.foreignChild .count-cell').textContent);
  
  const slAdultPrice = calTicketPrice(6, 4, localAdultCount, selectedSlots);
  localStorage.setItem('slAdultPrice', slAdultPrice);
  
  const slChildPrice = calTicketPrice(3, 2, localChildCount, selectedSlots);
  localStorage.setItem('slChildPrice', slChildPrice);
  
  const foreignAdultPrice = calTicketPrice(13, 10, foreignAdultCount, selectedSlots);
  localStorage.setItem('foreignAdultPrice', foreignAdultPrice);
  
  const foreignChildPrice = calTicketPrice(8, 5, foreignChildCount, selectedSlots);
  localStorage.setItem('foreignChildPrice', foreignChildPrice);
  
  const totalPrice = slAdultPrice + slChildPrice + foreignAdultPrice + foreignChildPrice;
  localStorage.setItem('TotalPrice', totalPrice);
  
  document.getElementById('slAdultPrice').innerText = slAdultPrice;
  document.getElementById('slChildPrice').innerText = slChildPrice;
  document.getElementById('foreignAdultPrice').innerText = foreignAdultPrice;
  document.getElementById('foreignChildPrice').innerText = foreignChildPrice;
  document.getElementById('TotalPrice').innerText = totalPrice;
}
updateTotalPrice(); */