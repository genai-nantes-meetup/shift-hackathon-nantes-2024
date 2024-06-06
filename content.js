console.log("Content script loaded");

const chunk = [];
let questionIndex = 1
let fakeText = "### Contexte\n" +
    "\n" +
    "*Sales* \n" +
    "\n" +
    "Bonjour Vincent, un grand merci d’avoir accepté un premier échange . Je vous propose de converser autour de la stratégie de décarbonation de Compass Group. \n" +
    "\n" +
    "*Vincent*\n" +
    "\n" +
    "Avec plaisir \n" +
    "\n" +
    "### 1ère question\n" +
    "\n" +
    "*Sales* \n" +
    "\n" +
    "Ma première question est la suivante : quelles sont vos objectifs de réduction carbone ?\n" +
    "\n" +
    "*Vincent* \n" +
    "\n" +
    "Nous sommes au début de la démarche de réduction de notre empreinte carbone chez Compass Group. Je suis en poste depuis 1 an et le Codir m’a donné comme mission de réduire nos émissions de 20 % à 3 ans."

let fakeText2 = 'On en est au début. Avec l’aide d’un cabinet de conseil, nous avons réalisé notre premier bilan carbone. Ce n’était pas évident, surtout dans la phase de collecte des données, elles étaient nombreuses et éparses. '
let fakeText3 = 'Nous avons utilisé la méthode réglementaire BEGES sur l’ensemble des scopes 1, 2 et 3.'

// Fonction pour obtenir l'horodatage actuel
function getCurrentTimestamp() {
    return new Date().toLocaleTimeString();
}

function getResponse() {
    fetch("http://localhost:3000", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok: ' + response.statusText);
            }
            // console.log(response)
            return response.json().then(data => ({
                status: response.status,
                body: data
            }));
        })
        .then(({status, body}) => {
            console.log(JSON.parse(body.body).message)
        })
        .catch(error => {
            console.log('catch error')
            if (error.response) {
                console.error('Status Code:', error.response.status);
                console.error('Response Body:', error.response.data);
            } else {
                console.error('Error:', error.message);
            }
        });
}

function sendCommunication(chunk) {
    fetch('https://hook.eu1.make.com/29r4koh8oycaq5n19blpcyzgi211b6p1', {
        method: 'POST',
        headers: {
            'Content-Type': 'text/plain'
        },
        body: chunk,
        compress: true,
    })
        .then(response => {
            if (response.status === 200) {
                return response.text();
            } else {
                throw new Error('Request failed with status ' + response.status);
            }
        })
        .then(data => {
            // console.log('Response data:', data);
            if (data === 'Accepted') {
                // getResponse()
                setTimeout(() => getResponse(), 5000);
            } else {
                throw new Error('Unexpected response data');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

}

// Fonction pour surveiller les sous-titres
function observeSubtitles() {
    const subtitleContainer = document.querySelector('.iOzk7'); // Remplacez par le sélecteur réel

    if (subtitleContainer) {
        const observer = new MutationObserver(mutations => {
            mutations.forEach(mutation => {
                mutation.removedNodes.forEach((node) => {
                    // if (chunk.length > 10) {
                    //     chunk.length = 0;
                    //     sendCommunication(chunk.toString())
                    // } else {
                        if (node.classList.contains('TBMuR')) {
                            chunk.push('Interlocuteur: ' + node.innerText);
                        } else {
                            chunk.push(node.innerText)
                        }
                    // }
                })
            });
        });

        observer.observe(subtitleContainer, {childList: true, subtree: true, attributes: true});
    } else {
        setTimeout(() => observeSubtitles(), 500);
        console.error('Subtitle container not found');
    }
}

// Appeler la fonction pour commencer à observer

// Écouter les messages pour déclencher le téléchargement
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // console.log('Message received in content script:', request);

    if (request.action === 'recordSubtitles') {
        observeSubtitles();
    }

    if (request.action === 'sendwebhook') {
        // console.log("webhook sent")
        switch (questionIndex) {
            case 1:
                // console.log("CASE 1")
                sendCommunication(fakeText)
                break
            case 2:
                // console.log("CASE 2")
                sendCommunication(fakeText2)
                break
            case 3:
                // console.log("CASE 3")
                sendCommunication(fakeText3)
                break
            case 4:
                // console.log("CASE 3")
                sendCommunication(fakeText3)
                break
            default:
                break
        }
        questionIndex++
    }
});


// <div className="TBMuR bj4p3b" style="">
//     <div><img alt="" className="KpxDtd r6DyN"
//               src="https://lh3.googleusercontent.com/a/ACg8ocKaYNx4tIydM59LgLaiA0mmQsSIR2aJFYvdzlqIzzqCp4fNxts=s50-p-k-no-mo"
//               data-iml="28947"/>
//         <div className="zs7s8d jxFHg">Vous</div>
//     </div>
//     <div jsname="YSxPC" className="Mz6pEf wY1pdd" style="height: 118.4px;">
//         <div jsname="tgaKEf" className="iTTPOb VbkSUe" style="text-indent: 598.263px;">
//         <span>histoire un moment donné la même </span><span>qualité </span>
//         <span>moi ce que vous faites de me dire une </span><span>solution pour repartir en question. </span>
//         <span>questionnement </span><span>tu vois, c'est un </span><span>Si tous les questions en fait à se </span><span>poser du coup, on s'arrête pas, on </span><span>s'arrête pas. </span>
//         </div>
//     </div>
// </div>