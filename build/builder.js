// elements
const button = document.getElementById('goButton');
const keyInput = document.getElementById('keyBox');
const nameInput = document.getElementById('nameBox');
const profileInput = document.getElementById('profileBox');
const dropdownmenu = document.getElementById('selector');

button.onclick = function() {
    const category = document.querySelector('#selector option:checked').parentElement.label
    const item = dropdownmenu.selectedOptions[0].value
    const key = keyInput.value
    fetch(`https://api.ashcon.app/mojang/v2/user/${nameInput.value}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.reason);
            } else {
                const uuid = data.uuid
                fetch('https://api.hypixel.net/skyblock/profiles?key=' + keyInput.value + '&uuid=' + uuid)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success != true) {
                            alert(data.cause);
                        } else {
                            const profiles = data.profiles;
                            let profile_id
                            // For each profile, check if cute_name matches the value of profileInput
                            for (let i = 0; i < profiles.length; i++) {
                                if (profiles[i].cute_name.toLowerCase() == profileInput.value.toLowerCase()) {
                                    console.log(profiles[i].cute_name);
                                    profile_id = profiles[i].profile_id;
                                    console.log(profile_id)
                                }}
                            if (profile_id == undefined) {
                                alert("Profile not found");
                            }
                            else {
                                const url = `/trackers/${encodeURIComponent(category)}/${encodeURIComponent(item)}/?key=${encodeURIComponent(key)}&uuid=${encodeURIComponent(uuid)}&profile_id=${encodeURIComponent(profile_id)}`;
                                return window.location.href = url;
                            }
            }})
    }})
}