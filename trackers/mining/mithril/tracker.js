// get the key from the url params
const urlParams = new URLSearchParams(window.location.search);
const key = urlParams.get('key');
const UUID = urlParams.get('uuid');
const playerName = urlParams.get('name');
const UUIDNoDashes = UUID.replace(/-/g, '');
const profile_id = urlParams.get('profile_id');

const SessionTotal = document.getElementById('SessionTotal');
const ItemsPerHour = document.getElementById('ItemsPerHour');
const CoinsPerHourDisplay = document.getElementById('CoinsPerHour');
const TotalCollectionDisplay = document.getElementById('TotalCollection');
const playerNameSpan = document.getElementById('playernameSpan');

let collectionStart
let startTime
let sellPrice = 10
let amountCollected
let totalCollection
let lastCheckTotal
let collectionPerHour
let coinsPerHour
let lastUpdateCheck
let lastChange

// initial fetch to get session beginning data
fetch('https://api.hypixel.net/skyblock/profile?key=' + key + '&profile=' + profile_id)
.then(response => response.json())
.then(data => {
    playerNameSpan.innerHTML = playerName
    console.log(data)
    collectionStart = data.profile.members[UUIDNoDashes].collection.MITHRIL_ORE
    console.log(collectionStart)
    startTime = new Date()
    updateStats()
})

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
        lastUpdateCheck = new Date()
        totalCollection = data.profile.members[UUIDNoDashes].collection.MITHRIL_ORE
        console.log(totalCollection)
        if (totalCollection === collectionStart || totalCollection != lastCheckTotal) {
            lastChange = new Date()
            console.log("updated2")
            lastCheckTotal = totalCollection
            amountCollected = totalCollection - collectionStart
            collectionPerHour = Math.round(amountCollected / (new Date() - startTime) * 3600000)
            coinsPerHour = collectionPerHour * sellPrice
            SessionTotal.innerHTML = commaify(amountCollected)
            ItemsPerHour.innerHTML = commaify(collectionPerHour)
            CoinsPerHourDisplay.innerHTML = commaify(coinsPerHour)
            TotalCollectionDisplay.innerHTML = commaify(totalCollection)
            if (coinsPerHour > 0) {
                updateChartData(chart, new Date(), coinsPerHour)
            }
        }
    })
}

let statUpdateInterval = setInterval(() => {
    updateStats()
}, 30000);