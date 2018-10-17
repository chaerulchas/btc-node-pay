const {Payment} = require('../src/payment')
const bcoin = require('bcoin');
const testdata = require('./testdata/data')
const assert = require('assert');

const network = bcoin.Network.get('regtest');
const host = null // do not connect to node
const xpub = "tpubDCPDDmriunw2e8s7aRg1Vfb8CXD6L2ntwnFqeaaw9fYWuksBSREVgzowxVzkfv7RbDk4FcjBh1vpDPEacEq8dRoPxeK4eZH3H6gvkB22fYY"

let paytrack = new Payment(xpub, host, network, {db:'../test/testdata/dummydb'})

describe('Test payment lib', function () {
    it('should return correct initial address for xpub', function () {
        assert.equal(paytrack.getNewAddress(1000, 'p2sh'), "2N1QdotNaP1dEzakk6TsZH6b39eL5u2eGXC")
    })
    it('should sequence to next derivation', function () {
        assert.equal(paytrack.getNewAddress(2000, 'p2sh'), "2NCyC98p9hAnPnH9xiRwG6zdyFJBYfMsCVz")
    })
    it('payment should not be paid', function () {
        paytrack.connected = true // fake
        assert.equal(paytrack.getStatus('2N1QdotNaP1dEzakk6TsZH6b39eL5u2eGXC').paid, false)
    })
    it('address should not be waiting for payment', function () {
        paytrack._handleMine(testdata.firstAddressTx.mine, testdata.firstAddressTx.tx)
        paytrack.connected = true // fake
        assert.equal(paytrack.getStatus('2N1QdotNaP1dEzakk6TsZH6b39eL5u2eGXC'), null)
    })
    it('txid should properly map to confirmation queue', function () {
        const txid = Buffer.from(testdata.firstAddressTx.tx.hash()).reverse().toString('hex')
        assert.equal(paytrack.waitingConfirmation[txid].address, '2N1QdotNaP1dEzakk6TsZH6b39eL5u2eGXC')
    })
    
})
   