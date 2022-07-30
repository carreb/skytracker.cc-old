// elements
const button = document.getElementById('goButton');
const keyInput = document.getElementById('keyBox');
const nameInput = document.getElementById('nameBox');
const profileInput = document.getElementById('profileBox');
const dropdownmenu = document.getElementById('selector');

button.onclick = function() {
    const category = document.querySelector('#selector option:checked').parentElement.label
    const item = dropdownmenu.selectedOptions[0].innerHTML
    const key = keyInput.value
    this.disabled = true;
    this.innerHTML = 'FETCHING UUID...';
    fetch(`https://api.ashcon.app/mojang/v2/user/${nameInput.value}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert(data.reason);
                this.disabled = false;
                this.innerHTML = 'GO TO TRACKER'
            } else {
                const uuid = data.uuid
                fetch('https://api.hypixel.net/skyblock/profiles?key=' + keyInput.value + '&uuid=' + uuid)
                    .then(response => response.json())
                    .then(data => {
                        if (data.success != true) {
                            alert(data.cause);
                            this.disabled = false;
                            this.innerHTML = 'GO TO TRACKER'
                        } else {
                            this.innerHTML = 'FETCHING PROFILE...'
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
                                this.disabled = false;
                                this.innerHTML = 'GO TO TRACKER'
                            }
                            else {
                                fetch('https://api.floaters.lol/hypixel/keys/', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        key: key,
                                    })
                                }).then(response => response.json())
                                .then(data => {
                                    console.log(data)
                                    this.innerHTML = 'WRAPPING UP...'
                                    const url = `/trackers/${encodeURIComponent(category.toLowerCase())}/${encodeURIComponent(item.toLowerCase())}/?key=${encodeURIComponent(key)}&uuid=${encodeURIComponent(uuid)}&profile_id=${encodeURIComponent(profile_id)}&name=${encodeURIComponent(nameInput.value)}`;
                                    return window.location.href = url;
                                })
                            }
            }})
    }})
}