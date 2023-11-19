

function toggleBottomBorder(clickedButton) {
    // Remove 'active' class from all buttons
    var buttons = document.querySelectorAll('.button');
    buttons.forEach(function(button) {
      button.classList.remove('selected');
    });

    // Add 'active' class to the clicked button
    clickedButton.classList.add('selected');
  }

  