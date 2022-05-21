
fetch('./assets/mocks/blockchains.json')
  .then(response => response.json())
  .then(data => {
    const listRef = document.querySelector('#blockchains-list');
    const btnRef = document.querySelector('#apply-btn');

    btnRef.addEventListener('click', (e) => {
      const wallet = document.querySelector('input').value;
      const chain = listRef.value;
      const url = `https://deep-index.moralis.io/api/v2/${wallet}/nft?chain=${chain}&format=decimal`;

      fetchNfts(url);
    });

    const blockchains = data;
    
    let listElements = '';

    blockchains.forEach(b => {
        listElements += `<option value="${b.currentSymbol}">${b.currentSymbol}</option>`;
    });

    listRef.innerHTML = listElements;
  });

  function fetchNfts(url) {
    const API_KEY = 'XUnDBl1fLvCROuwpgxpB645C1VrrjGGwfUDz6NmdJNo97qUCftf3a8TU0DGIu6Yo';
    const options = {
      method: 'GET',
      headers: new Headers({ 'X-API-Key': API_KEY }),
    };
  
    fetch(url, options).then(response => response.json())
      .then(data => {
        const ulRef = document.querySelector('#nfts-list');

        const nfts = data.result;
    
        let subListElements='';
        ulRef.innerHTML = subListElements;

        nfts.forEach((nft) => {
          const metadata = JSON.parse(nft.metadata);
          if (!metadata) return;
          Object.keys(metadata).map(key => {
            subListElements+=`
              <div class="col-md-4" style="min-height: 600px;">
                <h1 class="truncated">
                  <span title="${nft.token_address}">${nft.token_address}</span>
                </h1>
                ${key.includes("image")
                  ? `<img style="max-width: 100%;" src="${metadata[key]}" />`
                  : `<p class="truncated">
                      <span title="${metadata[key]}">${key}: ${metadata[key]}</span>
                    </p>`
                }
              </div>
            `;
            });
        });

        ulRef.innerHTML = subListElements;
      })
  }