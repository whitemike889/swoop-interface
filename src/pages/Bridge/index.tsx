import {CurrencyAmount, JSBI, Token, Trade} from '@swoop-exchange/sdk';
import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import {ArrowDown} from 'react-feather';
import ReactGA from 'react-ga';
import {Text} from 'rebass';
import {ThemeContext} from 'styled-components';
import AddressInputPanel from '../../components/AddressInputPanel';
import {ButtonError, ButtonLight, ButtonPrimary} from '../../components/Button';
import Card, {GreyCard} from '../../components/Card';
import {AutoColumn} from '../../components/Column';
import ConfirmSwapModal from '../../components/swap/ConfirmSwapModal';
import CurrencyInputPanel from '../../components/BridgeCurrencyInputPanel';
import {SwapPoolTabs} from '../../components/NavigationTabs';
import {AutoRow, RowBetween} from '../../components/Row';
import AdvancedSwapDetailsDropdown from '../../components/swap/AdvancedSwapDetailsDropdown';
import BetterTradeLink from '../../components/swap/BetterTradeLink';
import confirmPriceImpactWithoutFee from '../../components/swap/confirmPriceImpactWithoutFee';
import {ArrowWrapper, BottomGrouping, Dots, SwapCallbackError, Wrapper} from '../../components/swap/styleds';
import TradePrice from '../../components/swap/TradePrice';
import TokenWarningModal from '../../components/TokenWarningModal';

import {BETTER_TRADE_LINK_THRESHOLD, INITIAL_ALLOWED_SLIPPAGE} from '../../constants';
import {getTradeVersion, isTradeBetter} from '../../data/V1';
import {useCurrency} from '../../hooks/Tokens';
import {ApprovalState, useApproveCallbackFromTrade} from '../../hooks/useApproveCallback';
import useENSAddress from '../../hooks/useENSAddress';
import {useSwapCallback} from '../../hooks/useSwapCallback';
import useToggledVersion, {Version} from '../../hooks/useToggledVersion';
import useWrapCallback, {WrapType} from '../../hooks/useWrapCallback';
import {useToggleSettingsMenu, useWalletModalToggle} from '../../state/application/hooks';
import {Field} from '../../state/swap/actions';
import {
  useDefaultsFromURLSearch,
  useDerivedSwapInfo,
  useSwapActionHandlers,
  useSwapState,
} from '../../state/swap/hooks';
import {useExpertModeManager, useUserDeadline, useUserSlippageTolerance} from '../../state/user/hooks';
import {LinkStyledButton, TYPE} from '../../theme';
import {maxAmountSpend} from '../../utils/maxAmountSpend';
import {computeTradePriceBreakdown, warningSeverity} from '../../utils/prices';
import AppBody from '../AppBody';
import {ClickableText} from '../Pool/styleds';

import {useActiveHmyReact} from '../../hooks';
import {useAllEthereumBalances, useMetaMaskAccount} from '../../bridge/ETHWallet/hooks';

export default function Bridge() {
  const loadedUrlParams = useDefaultsFromURLSearch();

  const ETHAccount = useMetaMaskAccount();
  const ETHBalances = useAllEthereumBalances(ETHAccount);

  const currencyA = ETHBalances['LINK'] ? ETHBalances['LINK'].token : null
  const currencyB = ETHBalances['BUSD'] ? ETHBalances['BUSD'].token : null

  console.log({currencyA, currencyB})

  const currencies = {
    [Field.INPUT]: currencyA,
    [Field.OUTPUT]: currencyB,
  }

  const formattedAmounts = {
    [Field.INPUT]: '',
    [Field.OUTPUT]: '',
  };

  // token warning stuff
  const [loadedInputCurrency, loadedOutputCurrency] = [
    useCurrency(loadedUrlParams?.inputCurrencyId),
    useCurrency(loadedUrlParams?.outputCurrencyId),
  ];
  const [dismissTokenWarning, setDismissTokenWarning] = useState<boolean>(false);
  const urlLoadedTokens: Token[] = useMemo(
    () => [loadedInputCurrency, loadedOutputCurrency]?.filter((c): c is Token => c instanceof Token) ?? [],
    [loadedInputCurrency, loadedOutputCurrency],
  );
  const handleConfirmTokenWarning = useCallback(() => {
    setDismissTokenWarning(true);
  }, []);

  const {account} = useActiveHmyReact();

  const theme = useContext(ThemeContext);

  // toggle wallet when disconnected
  const toggleWalletModal = useWalletModalToggle();

  // for expert mode
  const toggleSettings = useToggleSettingsMenu();
  const [isExpertMode] = useExpertModeManager();

  // get custom setting values for user
  const [deadline] = useUserDeadline();
  const [allowedSlippage] = useUserSlippageTolerance();

  // swap state
  const {independentField, typedValue, recipient} = useSwapState();
 /* const {
    v1Trade,
    v2Trade,
    currencyBalances,
    parsedAmount,
    currencies,
    inputError: swapInputError,
  } = useDerivedSwapInfo();*/

 /* const {wrapType, execute: onWrap, inputError: wrapInputError} = useWrapCallback(
    currencies[Field.INPUT],
    currencies[Field.OUTPUT],
    typedValue,
  );*/
  /*const showWrap: boolean = wrapType !== WrapType.NOT_APPLICABLE;*/
  const {address: recipientAddress} = useENSAddress(recipient);
  const toggledVersion = useToggledVersion();
  /*const trade = showWrap
    ? undefined
    : {
      [Version.v1]: v1Trade,
      [Version.v2]: v2Trade,
    }[toggledVersion];

  const betterTradeLinkVersion: Version | undefined =
    toggledVersion === Version.v2 && isTradeBetter(v2Trade, v1Trade, BETTER_TRADE_LINK_THRESHOLD)
      ? Version.v1
      : toggledVersion === Version.v1 && isTradeBetter(v1Trade, v2Trade)
      ? Version.v2
      : undefined;*/

 /* const parsedAmounts = showWrap
    ? {
      [Field.INPUT]: parsedAmount,
      [Field.OUTPUT]: parsedAmount,
    }
    : {
      [Field.INPUT]: independentField === Field.INPUT ? parsedAmount : trade?.inputAmount,
      [Field.OUTPUT]: independentField === Field.OUTPUT ? parsedAmount : trade?.outputAmount,
    };*/

  const onSwitchTokens = () => {
    console.log('onSwitchTokens')
  }
  const onCurrencySelection = (field, currency) => {
    console.log('onCurrencySelection')
  }
  const onUserInput = (field, value) => {
    console.log('onUserInput')
  }
  const onChangeRecipient = (recipient) => {
    console.log('onChangeRecipient')
  }

  const isValid = true // !swapInputError;
  const dependentField: Field = independentField === Field.INPUT ? Field.OUTPUT : Field.INPUT;

  const handleTypeInput = useCallback(
    (value: string) => {
      onUserInput(Field.INPUT, value);
    },
    [onUserInput],
  );
  const handleTypeOutput = useCallback(
    (value: string) => {
      onUserInput(Field.OUTPUT, value);
    },
    [onUserInput],
  );

/*  // modal and loading
  const [{showConfirm, tradeToConfirm, swapErrorMessage, attemptingTxn, txHash}, setSwapState] = useState<{
    showConfirm: boolean
    tradeToConfirm: Trade | undefined
    attemptingTxn: boolean
    swapErrorMessage: string | undefined
    txHash: string | undefined
  }>({
    showConfirm: false,
    tradeToConfirm: undefined,
    attemptingTxn: false,
    swapErrorMessage: undefined,
    txHash: undefined,
  });*/

 /* const formattedAmounts = {
    [independentField]: typedValue,
    [dependentField]: showWrap
      ? parsedAmounts[independentField]?.toExact() ?? ''
      : parsedAmounts[dependentField]?.toSignificant(6) ?? '',
  };*/



  // check if user has gone through approval process, used to show two step buttons, reset on token change
  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false);


  //const maxAmountInput: CurrencyAmount | undefined = maxAmountSpend(currencyBalances[Field.INPUT]);
  //const atMaxAmountInput = Boolean(maxAmountInput && parsedAmounts[Field.INPUT]?.equalTo(maxAmountInput));

  // the callback to execute the swap
  /*const {callback: swapCallback, error: swapCallbackError} = useSwapCallback(
    trade,
    allowedSlippage,
    deadline,
    recipient,
  );*/

  // const {priceImpactWithoutFee} = computeTradePriceBreakdown(trade);

  const handleSwap = () => {
    console.log('handleSwap');
  };

  // errors
  const [showInverted, setShowInverted] = useState<boolean>(false);

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
/*  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED)) &&
    !(priceImpactSeverity > 3 && !isExpertMode);*/

  const handleConfirmDismiss = useCallback(() => {

    console.log('handleConfirmDismiss')
   /* setSwapState({showConfirm: false, tradeToConfirm, attemptingTxn, swapErrorMessage, txHash});
    // if there was a tx hash, we want to clear the input
    if (txHash) {
      onUserInput(Field.INPUT, '');
    }*/
  }, [ onUserInput]);

  const handleAcceptChanges = useCallback(() => {
    console.log('handleAcceptChanges')
  }, [ ]);

  const handleInputSelect = useCallback(
    inputCurrency => {
      setApprovalSubmitted(false); // reset 2 step UI for approvals
      onCurrencySelection(Field.INPUT, inputCurrency);
    },
    [onCurrencySelection],
  );

 /* const handleMaxInput = useCallback(() => {
    maxAmountInput && onUserInput(Field.INPUT, maxAmountInput.toExact());
  }, [maxAmountInput, onUserInput]);*/
  const handleMaxInput = useCallback(() => {
    console.log('max amount')
  }, [ onUserInput]);

  const handleOutputSelect = useCallback(outputCurrency => onCurrencySelection(Field.OUTPUT, outputCurrency), [
    onCurrencySelection,
  ]);

  // Custom wrapping progress workaround
  const [wrapInProgress, setWrapInProgress] = useState<boolean>(false);

  const handleWrap = useCallback(() => {

    console.log('handleWrap')
    setWrapInProgress(true);
  /*  onWrap()
      .then(() => {
        setWrapInProgress(false);
      })
      .catch((error: any) => {
        setWrapInProgress(false);
      });*/
  }, []);

  useEffect(() => {
  }, [wrapInProgress]);

  return (
    <>
      <TokenWarningModal
        isOpen={urlLoadedTokens.length > 0 && !dismissTokenWarning}
        tokens={urlLoadedTokens}
        onConfirm={handleConfirmTokenWarning}
      />
      <AppBody>
        <SwapPoolTabs active={'bridge'} />
        <Wrapper id="swap-page">
         {/* <ConfirmSwapModal
            isOpen={showConfirm}
            trade={trade}
            originalTrade={tradeToConfirm}
            onAcceptChanges={handleAcceptChanges}
            attemptingTxn={attemptingTxn}
            txHash={txHash}
            recipient={recipient}
            allowedSlippage={allowedSlippage}
            onConfirm={handleSwap}
            swapErrorMessage={swapErrorMessage}
            onDismiss={handleConfirmDismiss}
          />*/}

          <AutoColumn gap={'md'}>
            <CurrencyInputPanel
              label={'From'}
              value={formattedAmounts[Field.INPUT]}
              showMaxButton={true}
              currency={currencies[Field.INPUT]}
              onUserInput={handleTypeInput}
              onMax={handleMaxInput}
              onCurrencySelect={handleInputSelect}
              otherCurrency={currencies[Field.OUTPUT]}
              id="swap-currency-input"
            />

            <AutoColumn justify="space-between">
              <AutoRow justify="space-between" style={{padding: '0 1rem'}}>
                <ArrowWrapper clickable>
                  <ArrowDown
                    size="16"
                    onClick={() => {
                      setApprovalSubmitted(false); // reset 2 step UI for approvals
                      onSwitchTokens();
                    }}
                    color={currencies[Field.INPUT] && currencies[Field.OUTPUT] ? theme.primary1 : theme.text2}
                  />
                </ArrowWrapper>
              {/*  {recipient === null && !showWrap && isExpertMode ? (
                  <LinkStyledButton id="add-recipient-button" onClick={() => onChangeRecipient('')}>
                    + Add a send (optional)
                  </LinkStyledButton>
                ) : null}*/}
              </AutoRow>
            </AutoColumn>
            <CurrencyInputPanel
              value={formattedAmounts[Field.OUTPUT]}
              onUserInput={handleTypeOutput}
              label={'To'}
              showMaxButton={false}
              currency={currencies[Field.OUTPUT]}
              onCurrencySelect={handleOutputSelect}
              otherCurrency={currencies[Field.INPUT]}
              id="swap-currency-output"
            />

           {/* {recipient !== null && !showWrap ? (
              <>
                <AutoRow justify="space-between" style={{padding: '0 1rem'}}>
                  <ArrowWrapper clickable={false}>
                    <ArrowDown size="16" color={theme.text2} />
                  </ArrowWrapper>
                  <LinkStyledButton id="remove-recipient-button" onClick={() => onChangeRecipient(null)}>
                    - Remove send
                  </LinkStyledButton>
                </AutoRow>
                <AddressInputPanel id="recipient" value={recipient} onChange={onChangeRecipient} />
              </>
            ) : null}*/}

           {/* {showWrap ? null : (
              <Card padding={'.25rem .75rem 0 .75rem'} borderRadius={'20px'}>
                <AutoColumn gap="4px">
                  <RowBetween align="center">
                    <Text fontWeight={500} fontSize={14} color={theme.text2}>
                      Price
                    </Text>
                    <TradePrice
                      inputCurrency={currencies[Field.INPUT]}
                      outputCurrency={currencies[Field.OUTPUT]}
                      price={trade?.executionPrice}
                      showInverted={showInverted}
                      setShowInverted={setShowInverted}
                    />
                  </RowBetween>

                </AutoColumn>
              </Card>
            )}*/}
          </AutoColumn>
          <BottomGrouping>
            {!account ?  (
              <GreyCard style={{textAlign: 'center'}}>
                <TYPE.main mb="4px">Insufficient liquidity for this trade.</TYPE.main>
              </GreyCard>
            ) : (
              <ButtonError
                onClick={() => {
                  if (isExpertMode) {
                    handleSwap();
                  } else {
                   /* setSwapState({
                      tradeToConfirm: trade,
                      attemptingTxn: false,
                      swapErrorMessage: undefined,
                      showConfirm: true,
                      txHash: undefined,
                    });*/
                  }
                }}
                id="swap-button"
                disabled={!isValid && false}
                error={isValid && true}
              >
                <Text fontSize={20} fontWeight={500}>
                {/*  {
                    attemptingTxn && isExpertMode
                      ? <Dots>Swapping</Dots>
                      : swapInputError
                      ? swapInputError
                      : 'Swap on Bridge'}*/}
                </Text>
              </ButtonError>
            )}
            {/*{betterTradeLinkVersion && <BetterTradeLink version={betterTradeLinkVersion} />}*/}
          </BottomGrouping>
        </Wrapper>
      </AppBody>
      {/*<AdvancedSwapDetailsDropdown trade={trade} />*/}
    </>
  );
}
