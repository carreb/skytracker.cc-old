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
const timeUntilUpdateDisplay = document.getElementById('TimeUntilUpdate');
const timeSinceLastChangeDisplay = document.getElementById('TimeSinceChange');
const sellTypeSpan = document.getElementById('sellTypeSpan')
const trackedItem = window.location.href.split("/")[5]
const ITEMS = {
    // Farming Collections
    "cactus": "CACTUS",
    "carrots": "CARROT_ITEM",
    "cocoa beans": "INK_SACK:3",
    "feathers": "FEATHER",
    "leather": "LEATHER",
    "melon": "MELON",
    "mushroom": "MUSHROOM_COLLECTION",
    "mutton": "MUTTON",
    "nether wart": "NETHER_STALK",
    "potato:": "POTATO_ITEM",
    "pumpkin": "PUMPKIN",
    "chicken": "RAW_CHICKEN",
    "porkchop": "PORK",
    "rabbit": "RABBIT",
    "seeds": "SEEDS",
    "sugarcane": "SUGAR_CANE",
    "wheat": "WHEAT",
    // Mining Collections
    "coal": "COAL",
    "cobblestone": "COBBLESTONE",
    "diamond": "DIAMOND",
    "emerald": "EMERALD",
    "end stone": "ENDER_STONE",
    "gemstones": "GEMSTONE_COLLECTION",
    "glowstone": "GLOWSTONE_DUST",
    "gold": "GOLD_INGOT",
    "hard stone": "HARD_STONE",
    "ice": "ICE",
    "iron": "IRON_INGOT",
    "lapis": "INK_SACK:4",
    "mithril": "MITHRIL_ORE",
    "mycelium": "MYCEL",
    "nether quartz": "QUARTZ",
    "netherrack": "NETHERRACK",
    "obsidian": "OBSIDIAN",
    "red sand": "SAND:1",
    "redstone": "REDSTONE",
    "sand": "SAND",
    "sulphur": "SULPHUR_ORE",
    // Combat Collections
    "blaze rod": "BLAZE_ROD",
    "bone": "BONE",
    "ender pearls": "ENDER_PEARL",
    "ghast tear": "GHAST_TEAR",
    "gunpowder": "SULPHUR",
    "magma cream": "MAGMA_CREAM",
    "rotten flesh": "ROTTEN_FLESH",
    "slimeball": "SLIME_BALL",
    "spider eye": "SPIDER_EYE",
    "string": "STRING",
    // Foraging Collections
    "acacia": "LOG_2",
    "birch": "LOG:2",
    "dark oak": "LOG_2:1",
    "jungle": "LOG:3",
    "oak": "LOG",
    "spruce": "LOG:1",
    // Fishing Collections
    "clay": "CLAY_BALL",
    "clownfish": "RAW_FISH:2",
    "ink sac": "INK_SACK",
    "lilypad": "WATER_LILY",
    "magmafish": "MAGMA_FISH",
    "prismarine crystals": "PRISMARINE_CRYSTALS",
    "prismarine shards": "PRISMARINE_SHARD",
    "pufferfish": "RAW_FISH:3",
    "raw fish": "RAW_FISH",
    "salmon": "RAW_FISH:1",
    "sponge": "SPONGE",
}

const trackedItemInternalID = ITEMS[trackedItem]
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
        collectionStart = data.profile.members[UUIDNoDashes].collection[trackedItemInternalID]
        console.log(collectionStart)
        startTime = new Date()
        updateStats()
    })
    .catch(error => { 
        if (error == "TypeError: data.profile.members[UUIDNoDashes].collection is undefined") {
        window.location.href = "/errors/collection-off.html"
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
        totalCollection = data.profile.members[UUIDNoDashes].collection[trackedItemInternalID]
        console.log(totalCollection)
        if (totalCollection === collectionStart || totalCollection != lastCheckTotal) {
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

function getUpdatedSellPrice() {
  fetch('https://api.skytracker.cc/npc')
  .then(response => response.json())
  .then(data => {
    NPCPrice = data[trackedItemInternalID]
    console.log('NPC PRICE: ' + NPCPrice)
    fetch('https://api.hypixel.net/skyblock/bazaar')
    .then(response => response.json())
    .then(data => {
        console.log(data)
        BZPrice = data.products[trackedItemInternalID].sell_summary[0].pricePerUnit
        if (BZPrice > NPCPrice) {
            sellPrice = BZPrice
            sellTypeSpan.innerHTML = "BZ"
        } else {
            sellPrice = NPCPrice
            sellTypeSpan.innerHTML = "NPC"
        }
    }).catch(error => {
        sellPrice = NPCPrice
        sellTypeSpan.innerHTML = "NPC"
    })
  })
}

getUpdatedSellPrice()

bazaarSellPriceInterval = setInterval(() => {
  getUpdatedSellPrice()
}, 600000)