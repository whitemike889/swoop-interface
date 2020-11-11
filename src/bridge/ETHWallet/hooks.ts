import {useEffect, useState} from 'react';
import {getAllEthereumBalances, isMetaMaskConnected} from './web3';
import {useAllTokens} from '../../hooks/Tokens';
import {TokenAmount} from '@swoop-exchange/sdk';

type TBalances = Record<string, TokenAmount>

const interval = 60000;

const formatTokens = (swoopTokens, etherTokens) => {
  return Object.keys(etherTokens).map(key => {
    const harmonyAddress = etherTokens[key].harmonyAddress;

    if (!harmonyAddress || !swoopTokens[harmonyAddress]) {
      console.error(`Ethereum token ${key} doesn't have a match on Harmony`, {swoopTokens});
      return null;
    }

    return ({[key]: new TokenAmount(swoopTokens[harmonyAddress], etherTokens[key].balance)});
  })
    .filter(e => !!e)
    .reduce((a, b) => ({...a, ...b}), {});
};

export const useAllEthereumBalances = (address) => {
  const [balances, setBalances] = useState<TBalances>({});
  const swoopTokens = useAllTokens();

  useEffect(() => {
    let id;

    const run = () => {
      getAllEthereumBalances(address)
        .then(balances => formatTokens(swoopTokens, balances))
        .then(setBalances)
        .then(() => {
          id = setTimeout(run, interval);
        });
    };

    if (!id && address) {
      run();
    }

    return () => clearTimeout(id);
  }, [address, swoopTokens]);

  return balances;
};

// todo disconnect? change state
export const useMetaMaskAccount = (connectMetaMask: boolean = false) => {
  const [account, setAccount] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const connect = async () => {
      if (isLoading) {
        return
      }

      const provider = window.ethereum

      setIsLoading(true);
      try {
        //@ts-ignore
        const accounts = await provider.request({method: 'eth_requestAccounts'});

        provider.on('accountsChanged', (accounts) =>
          setAccount(accounts[0])
        )

        provider.on('disconnect', () => {
          setAccount(null)
        })

        setAccount(accounts[0]);
      } catch (e) {
      }
      setIsLoading(false);
    };

    if (account) {
      return;
    }

    const isConnected = isMetaMaskConnected();

    if (!isConnected) {
      return
    }

    // @ts-ignore
    if (window.web3 && window.web3.eth.accounts.length > 0) {
      // @ts-ignore
      setAccount(window.web3.eth.accounts[0]);
      return;
    }

    if (connectMetaMask && !isLoading) {
      connect();
      return;
    }

    // give it some time to get ready
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000);
  }, [isLoading, setIsLoading, account, setAccount, connectMetaMask]);

  return account;
};