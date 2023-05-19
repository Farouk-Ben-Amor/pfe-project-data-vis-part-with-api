// Fetch data from the API endpoint
fetch('http://127.0.0.1:8000/api/projects/')
  .then(response => response.json())
  .then(data => {
    // Call functions to create the charts
    createReviewChart(data);
    createOwnerChart(data);
    createProjectPieChart(data); 
    displayDeveloperCount(data);
    displayProjectCount(data);
  })
  .catch(error => {
    console.log('Error:', error);
  });



  
// Function to create the chart for project reviews
function createReviewChart(data) {
  const projectTitles = data.map(project => `${project.title} (${project.owner.name})`);

  //const projectTitles = data.map(project => project.title );
  const voteTotals = data.map(project => project.vote_total);
  const voteRatios = data.map(project => project.vote_ratio);

  const ctx = document.getElementById('reviewChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: projectTitles,
      datasets: [
        {
          label: 'Vote Total',
          data: voteTotals,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Vote Ratio',
          data: voteRatios,
          backgroundColor: 'rgba(192, 75, 192, 0.2)',
          borderColor: 'rgba(192, 75, 192, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
}

// Function to create the chart for owner project counts
function createOwnerChart(data) {
  const owners = {};

  data.forEach(project => {
    const owner = project.owner.name;
    if (owners[owner]) {
      owners[owner]++;
    } else {
      owners[owner] = 1;
    }
  });

  const ownerNames = Object.keys(owners);
  const projectCounts = Object.values(owners);

  const ctx = document.getElementById('ownerChart').getContext('2d');
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ownerNames,
      datasets: [
        {
          label: 'Number of Projects',
          data: projectCounts,
          backgroundColor: 'rgba(192, 192, 75, 0.2)',
          borderColor: 'rgba(192, 192, 75, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 1
        }
      }
    }
  });
}





// Function to create the pie chart for project distribution
function createProjectPieChart(data) {
  const projects = {};
  data.forEach(project => {
    const owner = project.owner.name;
    if (projects[owner]) {
      projects[owner]++;
    } else {
      projects[owner] = 1;
    }
  });

  const projectNames = Object.keys(projects);
  const projectCounts = Object.values(projects);

  const ctx = document.getElementById('projectPieChart').getContext('2d');
  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: projectNames,
      datasets: [
        {
          data: projectCounts,
          backgroundColor: [
            'rgba(255, 99, 132, 0.8)',
            'rgba(54, 162, 235, 0.8)',
            'rgba(255, 206, 86, 0.8)',
            'rgba(75, 192, 192, 0.8)',
            'rgba(153, 102, 255, 0.8)',
            'rgba(255, 159, 64, 0.8)',
            'rgba(244, 67, 54, 0.8)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(139, 195, 74, 0.8)',
            'rgba(0, 150, 136, 0.8)'
          ]
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        tooltip: {
          callbacks: {
            label: function (context) {
              const project = context.label;
              const count = context.parsed;
              return `${project}: ${count}`;
            }
          }
        }
      }
    }
  });
}






function displayDeveloperCount(data) {
  const developers = new Set();

  data.forEach(project => {
    const owner = project.owner.id;
    developers.add(owner);
  });

  const totalDevelopers = developers.size;

  // Update the HTML element to display the developer count
  document.getElementById('developerCount').textContent = totalDevelopers;
}

function displayProjectCount(data) {
  const totalProjects = data.length;

  // Update the HTML element to display the project count
  document.getElementById('projectCount').textContent = totalProjects;
}