// get the key from the url params
const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.get('key');
const UUID = urlParams.get('uuid');
const playerName = urlParams.get('name');
const UUIDNoDashes = UUID.replace(/-/g, '');
const profile_id = urlParams.get('profile_id');
const SessionTotal = document.getElementById('SessionTotal');
const ItemsPerHour = document.getElementById('ItemsPerHour');
// const CoinsPerHourDisplay = document.getElementById('CoinsPerHour');
const TotalCollectionDisplay = document.getElementById('TotalCollection');
const playerNameSpan = document.getElementById('playernameSpan');
const timeUntilUpdateDisplay = document.getElementById('TimeUntilUpdate');
const timeSinceLastChangeDisplay = document.getElementById('TimeSinceChange');
const sellTypeSpan = document.getElementById('sellTypeSpan')
let trackedItem = window.location.href.split("/")[5]
// replace %20 with spaces
trackedItem = trackedItem.replace(/%20/g, " ")
const ITEMS = {
    "mining exp": "experience_skill_mining",
    "farming exp": "experience_skill_farming",
    "combat exp": "experience_skill_combat",
    "foraging exp": "experience_skill_foraging",
    "fishing exp": "experience_skill_fishing",
    "enchanting exp": "experience_skill_enchanting",
    "alchemy exp": "experience_skill_alchemy",
    "taming exp": "experience_skill_taming",
    "carpentry exp": "experience_skill_carpentry",
    "runecrafting exp": "experience_skill_runecrafting"
}

const trackedItemInternalID = ITEMS[trackedItem.toLowerCase()]
console.log(trackedItemInternalID)


let collectionStart
let startTime
let sellPrice
let NPCPrice
let BZPrice
let amountCollected
let totalCollection
let lastCheckTotal
let collectionPerHour
let coinsPerHour
let lastUpdateCheck
let lastChange

// initial fetch to get session beginning data
function initialFetch() {
    fetch('https://api.hypixel.net/skyblock/profile?key=' + key + '&profile=' + profile_id)
    .then(response => response.json())
    .then(data => {
        playerNameSpan.innerHTML = playerName
        console.log(data)
        collectionStart = Math.round(data.profile.members[UUIDNoDashes][trackedItemInternalID])
        console.log(collectionStart)
        startTime = new Date()
        updateStats()
    })
    .catch(error => { 
        if (error == "TypeError: data.profile.members[UUIDNoDashes][trackedItemInternalID] is undefined") {
        window.location.href = "/errors/skills-off.html"
    }})
}

initialFetch()

function updateChartData(chart, label, data) {
    chart.data.labels.push(label)
    chart.data.datasets.forEach((dataset) => {
        dataset.data.push(data)
    });
    chart.update()
}

function commaify(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function updateStats() {
    fetch('https://api.hypixel.net/skyblock/profile?key=' + key + '&profile=' + profile_id)
    .then(response => response.json())
    .then(data => {
        console.log("updated")
        lastUpdateCheck = 30
        totalCollection = Math.round(data.profile.members[UUIDNoDashes][trackedItemInternalID])
        console.log(totalCollection)
        if (totalCollection === collectionStart || totalCollection != lastCheckTotal) {
            console.log("updated2")
            lastCheckTotal = totalCollection
            amountCollected = totalCollection - collectionStart
            collectionPerHour = Math.round(amountCollected / (new Date() - startTime) * 3600000)
            coinsPerHour = collectionPerHour * sellPrice
            SessionTotal.innerHTML = commaify(amountCollected)
            ItemsPerHour.innerHTML = commaify(collectionPerHour)
            // CoinsPerHourDisplay.innerHTML = commaify(coinsPerHour)
            TotalCollectionDisplay.innerHTML = commaify(totalCollection)
            if (collectionPerHour > 0) {
                updateChartData(chart, new Date(), collectionPerHour)
                lastChange = new Date()
            }
        }
    })
}

function updateTimeDisplays() {
    lastUpdateCheck = lastUpdateCheck - 1
    timeUntilUpdateDisplay.innerHTML = Math.round(lastUpdateCheck)  + " seconds"
    if (getTimeAgo(lastChange) != "NaN year ago") {
        timeSinceLastChangeDisplay.innerHTML = getTimeAgo(lastChange)
    }

}

let timeDisplayInterval = setInterval(() => {
    updateTimeDisplays()
}, 1000)

let statUpdateInterval = setInterval(() => {
    updateStats()
}, 30000);





// date stuff


const MINUTE = 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;
const WEEK = DAY * 7;
const MONTH = DAY * 30;
const YEAR = DAY * 365;

function getTimeAgo(date) {
  const secondsAgo = Math.round((Date.now() - Number(date)) / 1000);

  if (secondsAgo < MINUTE) {
    return secondsAgo + ` second${secondsAgo !== 1 ? "s" : ""} ago`;
  }

  let divisor;
  let unit = "";

  if (secondsAgo < HOUR) {
    [divisor, unit] = [MINUTE, "minute"];
  } else if (secondsAgo < DAY) {
    [divisor, unit] = [HOUR, "hour"];
  } else if (secondsAgo < WEEK) {
    [divisor, unit] = [DAY, "day"];
  } else if (secondsAgo < MONTH) {
    [divisor, unit] = [WEEK, "week"];
  } else if (secondsAgo < YEAR) {
    [divisor, unit] = [MONTH, "month"];
  } else {
    [divisor, unit] = [YEAR, "year"];
  }

  const count = Math.floor(secondsAgo / divisor);
  return `${count} ${unit}${count > 1 ? "s" : ""} ago`;
}