/*
Copyright 2018 - 2022 The Alephium Authors
This file is part of the alephium project.

The library is free software: you can redistribute it and/or modify
it under the terms of the GNU Lesser General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

The library is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
GNU Lesser General Public License for more details.

You should have received a copy of the GNU Lesser General Public License
along with the library. If not, see <http://www.gnu.org/licenses/>.
*/

import {
  abbreviateAmount,
  calAmountDelta,
  convertScientificToFloatString,
  convertAlphToSet,
  countDecimals,
  removeTrailingZeros,
  convertSetToAlph,
  removeLeadingZeros
} from '../lib/numbers'
import transactions from './fixtures/transactions.json'

const alph = (amount: bigint) => {
  return amount * BigInt('1000000000000000000')
}

const minDigits = 3

it('Should abbreviate amount', () => {
  expect(abbreviateAmount(alph(BigInt(-1)))).toEqual('???'),
    expect(abbreviateAmount(BigInt(0))).toEqual('0.00'),
    expect(abbreviateAmount(BigInt(1))).toEqual('0.00'),
    expect(abbreviateAmount(BigInt(100000))).toEqual('0.00'),
    expect(abbreviateAmount(BigInt(900000000000))).toEqual('0.00'),
    expect(abbreviateAmount(BigInt(4000000000000))).toEqual('0.00'),
    expect(abbreviateAmount(BigInt(5000000000000))).toEqual('0.00001'),
    expect(abbreviateAmount(BigInt(6000000000000))).toEqual('0.00001'),
    expect(abbreviateAmount(BigInt(2000000000000000))).toEqual('0.002'),
    expect(abbreviateAmount(BigInt('20000000000000000'))).toEqual('0.02'),
    expect(abbreviateAmount(BigInt('200000000000000000'))).toEqual('0.2'),
    expect(abbreviateAmount(BigInt('2000000000000000000'))).toEqual('2.00'),
    expect(abbreviateAmount(alph(BigInt(1230)))).toEqual("1'230.00"),
    expect(abbreviateAmount(alph(BigInt(1230000)))).toEqual('1.23M'),
    expect(abbreviateAmount(alph(BigInt(1234000)))).toEqual('1.23M'),
    expect(abbreviateAmount(alph(BigInt(1230000000)))).toEqual('1.23B'),
    expect(abbreviateAmount(alph(BigInt(1235000000)))).toEqual('1.24B'),
    expect(abbreviateAmount(alph(BigInt(1230000000000)))).toEqual('1.23T'),
    expect(abbreviateAmount(alph(BigInt(1237000000000)))).toEqual('1.24T'),
    expect(abbreviateAmount(alph(BigInt(1230000000000000)))).toEqual('1230.00T'),
    expect(abbreviateAmount(alph(BigInt(1)))).toEqual('1.00')
})

it('Should keep full amount precision', () => {
  expect(abbreviateAmount(alph(BigInt(-1)))).toEqual('???'),
    expect(abbreviateAmount(BigInt(0), true)).toEqual('0.00'),
    expect(abbreviateAmount(BigInt(1), true)).toEqual('0.000000000000000001'),
    expect(abbreviateAmount(BigInt(100001), true)).toEqual('0.000000000000100001'),
    expect(abbreviateAmount(BigInt(1000000000), true)).toEqual('0.000000001'),
    expect(abbreviateAmount(BigInt(1000000001), true)).toEqual('0.000000001000000001'),
    expect(abbreviateAmount(BigInt(2000000000), true)).toEqual('0.000000002'),
    expect(abbreviateAmount(BigInt(2000000002), true)).toEqual('0.000000002000000002'),
    expect(abbreviateAmount(BigInt(2000000000000000), true)).toEqual('0.002'),
    expect(abbreviateAmount(BigInt('20000000000000000'), true)).toEqual('0.02'),
    expect(abbreviateAmount(BigInt('200000000000000000'), true)).toEqual('0.2'),
    expect(abbreviateAmount(BigInt('2000000000000000000'), true)).toEqual('2.00'),
    expect(abbreviateAmount(alph(BigInt(1230)), true)).toEqual('1230.00'),
    expect(abbreviateAmount(alph(BigInt(1230000)), true)).toEqual('1230000.00'),
    expect(abbreviateAmount(alph(BigInt(1230000000)), true)).toEqual('1230000000.00'),
    expect(abbreviateAmount(alph(BigInt(1230000000000)), true)).toEqual('1230000000000.00'),
    expect(abbreviateAmount(alph(BigInt(1230000000000000)), true)).toEqual('1230000000000000.00'),
    expect(abbreviateAmount(alph(BigInt(1)), true)).toEqual('1.00')
})

it('Should remove trailing zeros', () => {
  expect(removeTrailingZeros('0.00010000', minDigits)).toEqual('0.0001'),
    expect(removeTrailingZeros('10000.000', minDigits)).toEqual('10000.000'),
    expect(removeTrailingZeros('-10000.0001000', minDigits)).toEqual('-10000.0001'),
    expect(removeTrailingZeros('-0.0001020000', minDigits)).toEqual('-0.000102'),
    expect(removeTrailingZeros('0.00010000')).toEqual('0.0001'),
    expect(removeTrailingZeros('10000.000')).toEqual('10000'),
    expect(removeTrailingZeros('-10000.0001000')).toEqual('-10000.0001'),
    expect(removeTrailingZeros('-0.0001020000')).toEqual('-0.000102')
})

it('should calucate the amount delta between the inputs and outputs of an address in a transaction', () => {
  expect(calAmountDelta(transactions.oneInputOneOutput, transactions.oneInputOneOutput.inputs[0].address)).toEqual(
    alph(BigInt(-50))
  ),
    expect(calAmountDelta(transactions.twoInputsOneOutput, transactions.twoInputsOneOutput.inputs[0].address)).toEqual(
      alph(BigInt(-150))
    ),
    expect(
      calAmountDelta(transactions.twoInputsZeroOutput, transactions.twoInputsZeroOutput.inputs[0].address)
    ).toEqual(alph(BigInt(-200))),
    expect(() =>
      calAmountDelta(transactions.missingInputs, transactions.missingInputs.outputs[0].address)
    ).toThrowError('Missing transaction details'),
    expect(() =>
      calAmountDelta(transactions.missingOutputs, transactions.missingOutputs.inputs[0].address)
    ).toThrowError('Missing transaction details')
})

it('should convert Alph amount to Set amount', () => {
  expect(convertAlphToSet('-1')).toEqual('-1000000000000000000'),
    expect(convertAlphToSet('0')).toEqual('0'),
    expect(convertAlphToSet('1')).toEqual('1000000000000000000'),
    expect(convertAlphToSet('10')).toEqual('10000000000000000000'),
    expect(convertAlphToSet('999999999')).toEqual('999999999000000000000000000'),
    expect(convertAlphToSet('999999999999')).toEqual('999999999999000000000000000000'),
    expect(convertAlphToSet('0.1')).toEqual('100000000000000000'),
    expect(convertAlphToSet('.1')).toEqual('100000000000000000'),
    expect(convertAlphToSet('0.01')).toEqual('10000000000000000'),
    expect(convertAlphToSet('0.00000009')).toEqual('90000000000'),
    expect(convertAlphToSet('0.000000000000000001')).toEqual('1'),
    expect(convertAlphToSet('-0.000000000000000001')).toEqual('-1'),
    expect(convertAlphToSet('1e-1')).toEqual('100000000000000000'),
    expect(convertAlphToSet('1e-2')).toEqual('10000000000000000'),
    expect(convertAlphToSet('1e-17')).toEqual('10'),
    expect(convertAlphToSet('1e-18')).toEqual('1'),
    expect(convertAlphToSet('1.1e-1')).toEqual('110000000000000000'),
    expect(convertAlphToSet('1.11e-1')).toEqual('111000000000000000'),
    expect(convertAlphToSet('1.99999999999999999e-1')).toEqual('199999999999999999'),
    expect(convertAlphToSet('1e+1')).toEqual('10000000000000000000'),
    expect(convertAlphToSet('1e+2')).toEqual('100000000000000000000'),
    expect(convertAlphToSet('1e+17')).toEqual('100000000000000000000000000000000000'),
    expect(convertAlphToSet('1e+18')).toEqual('1000000000000000000000000000000000000'),
    expect(convertAlphToSet('1.1e+1')).toEqual('11000000000000000000'),
    expect(convertAlphToSet('1.99999999999999999e+1')).toEqual('19999999999999999900'),
    expect(convertAlphToSet('123.45678e+2')).toEqual('12345678000000000000000'),
    expect(convertAlphToSet('-1e-1')).toEqual('-100000000000000000'),
    expect(convertAlphToSet('-1e-2')).toEqual('-10000000000000000'),
    expect(convertAlphToSet('-1e-17')).toEqual('-10'),
    expect(convertAlphToSet('-1e-18')).toEqual('-1'),
    expect(convertAlphToSet('-1.1e-1')).toEqual('-110000000000000000'),
    expect(convertAlphToSet('-1.11e-1')).toEqual('-111000000000000000'),
    expect(convertAlphToSet('-1.99999999999999999e-1')).toEqual('-199999999999999999'),
    expect(convertAlphToSet('-1e+1')).toEqual('-10000000000000000000'),
    expect(convertAlphToSet('-1e+2')).toEqual('-100000000000000000000'),
    expect(convertAlphToSet('-1e+17')).toEqual('-100000000000000000000000000000000000'),
    expect(convertAlphToSet('-1e+18')).toEqual('-1000000000000000000000000000000000000'),
    expect(convertAlphToSet('-1.1e+1')).toEqual('-11000000000000000000'),
    expect(convertAlphToSet('-1.99999999999999999e+1')).toEqual('-19999999999999999900'),
    expect(convertAlphToSet('-123.45678e+2')).toEqual('-12345678000000000000000')
})

it('should convert scientific numbers to floats or integers', () => {
  expect(convertScientificToFloatString('1e-1')).toEqual('0.1'),
    expect(convertScientificToFloatString('1e-2')).toEqual('0.01'),
    expect(convertScientificToFloatString('1e-17')).toEqual('0.00000000000000001'),
    expect(convertScientificToFloatString('1e-18')).toEqual('0.000000000000000001'),
    expect(convertScientificToFloatString('1.1e-1')).toEqual('0.11'),
    expect(convertScientificToFloatString('1.11e-1')).toEqual('0.111'),
    expect(convertScientificToFloatString('1.99999999999999999e-1')).toEqual('0.199999999999999999'),
    expect(convertScientificToFloatString('123.45678e-2')).toEqual('1.2345678'),
    expect(convertScientificToFloatString('1e+1')).toEqual('10'),
    expect(convertScientificToFloatString('1e+2')).toEqual('100'),
    expect(convertScientificToFloatString('1e+17')).toEqual('100000000000000000'),
    expect(convertScientificToFloatString('1e+18')).toEqual('1000000000000000000'),
    expect(convertScientificToFloatString('1.1e+1')).toEqual('11'),
    expect(convertScientificToFloatString('1.99999999999999999e+1')).toEqual('19.9999999999999999'),
    expect(convertScientificToFloatString('123.45678e+2')).toEqual('12345.678'),
    expect(convertScientificToFloatString('-1e-1')).toEqual('-0.1'),
    expect(convertScientificToFloatString('-1e-2')).toEqual('-0.01'),
    expect(convertScientificToFloatString('-1e-17')).toEqual('-0.00000000000000001'),
    expect(convertScientificToFloatString('-1e-18')).toEqual('-0.000000000000000001'),
    expect(convertScientificToFloatString('-1.1e-1')).toEqual('-0.11'),
    expect(convertScientificToFloatString('-1.11e-1')).toEqual('-0.111'),
    expect(convertScientificToFloatString('-1.99999999999999999e-1')).toEqual('-0.199999999999999999'),
    expect(convertScientificToFloatString('-123.45678e-2')).toEqual('-1.2345678'),
    expect(convertScientificToFloatString('-1e+1')).toEqual('-10'),
    expect(convertScientificToFloatString('-1e+2')).toEqual('-100'),
    expect(convertScientificToFloatString('-1e+17')).toEqual('-100000000000000000'),
    expect(convertScientificToFloatString('-1e+18')).toEqual('-1000000000000000000'),
    expect(convertScientificToFloatString('-1.1e+1')).toEqual('-11'),
    expect(convertScientificToFloatString('-1.99999999999999999e+1')).toEqual('-19.9999999999999999'),
    expect(convertScientificToFloatString('-123.45678e+2')).toEqual('-12345.678'),
    expect(convertScientificToFloatString('123.45678e2')).toEqual('12345.678'),
    expect(convertScientificToFloatString('1e18')).toEqual('1000000000000000000'),
    expect(convertScientificToFloatString('.1e19')).toEqual('1000000000000000000')
})

it('should calculate number of decimals', () => {
  expect(countDecimals(0.1)).toEqual(1),
    expect(countDecimals(0.19)).toEqual(2),
    expect(countDecimals(1000000.10001)).toEqual(5),
    expect(countDecimals(1000000.0000000001)).toEqual(10),
    expect(countDecimals(0.1234567891234567)).toEqual(16),
    expect(countDecimals(-0.1)).toEqual(1),
    expect(countDecimals(-0.19)).toEqual(2),
    expect(countDecimals(-1000000.10001)).toEqual(5),
    expect(countDecimals(-1000000.0000000001)).toEqual(10),
    expect(countDecimals(1e-17)).toEqual(17),
    expect(countDecimals(1.1e-17)).toEqual(18),
    expect(countDecimals(-1.23456789e-20)).toEqual(28),
    expect(countDecimals(-1.2e100)).toEqual(0),
    expect(countDecimals(1.23456789e-20)).toEqual(28)

  // The following tests will fail:
  // expect(countDecimals(1000000000000000.01)).toEqual(2),
  // expect(countDecimals(100000000000000.001)).toEqual(3),
  // expect(countDecimals(10000000000000.0001)).toEqual(4),
  // expect(countDecimals(1000000000000.00001)).toEqual(5),
  // expect(countDecimals(100000000000.000001)).toEqual(6),
  // expect(countDecimals(10000000000.0000001)).toEqual(7),
  // expect(countDecimals(1000000000.00000001)).toEqual(8),
  // expect(countDecimals(100000000.000000001)).toEqual(9),
  // expect(countDecimals(10000000.0000000001)).toEqual(10),
  // expect(countDecimals(1000000.00000000001)).toEqual(11),
  // expect(countDecimals(100000.000000000001)).toEqual(12),
  // expect(countDecimals(10000.0000000000001)).toEqual(13),
  // expect(countDecimals(1000.00000000000001)).toEqual(14),
  // expect(countDecimals(100.000000000000001)).toEqual(15),
  // expect(countDecimals(10.0000000000000001)).toEqual(16)
})

it('should convert Set amount amount to Alph amount', () => {
  expect(convertSetToAlph('0')).toEqual('0'),
    expect(convertSetToAlph('1')).toEqual('0.000000000000000001'),
    expect(convertSetToAlph('100000000000000000')).toEqual('0.1'),
    expect(convertSetToAlph('1000000000000000000')).toEqual('1'),
    expect(convertSetToAlph('99999917646000000000000')).toEqual('99999.917646'),
    expect(convertSetToAlph('99999917646000000000001')).toEqual('99999.917646000000000001'),
    expect(convertSetToAlph(BigInt('0'))).toEqual('0'),
    expect(convertSetToAlph(BigInt('1'))).toEqual('0.000000000000000001'),
    expect(convertSetToAlph(BigInt('100000000000000000'))).toEqual('0.1'),
    expect(convertSetToAlph(BigInt('1000000000000000000'))).toEqual('1'),
    expect(convertSetToAlph(BigInt('99999917646000000000000'))).toEqual('99999.917646'),
    expect(convertSetToAlph(BigInt('99999917646000000000001'))).toEqual('99999.917646000000000001'),
    expect(() => convertSetToAlph('0.1')).toThrowError('Invalid Set amount'),
    expect(() => convertSetToAlph('1.1')).toThrowError('Invalid Set amount'),
    expect(() => convertSetToAlph('-1')).toThrowError('Invalid Set amount'),
    expect(() => convertSetToAlph('1000000a000000')).toThrowError('Invalid Set amount')
})

it('should remove leading zeros', () => {
  expect(removeLeadingZeros('0')).toEqual('0'),
    expect(removeLeadingZeros('01')).toEqual('1'),
    expect(removeLeadingZeros('0.1')).toEqual('0.1'),
    expect(removeLeadingZeros('000.1')).toEqual('0.1'),
    expect(removeLeadingZeros('1')).toEqual('1'),
    expect(removeLeadingZeros('01.0')).toEqual('1.0'),
    expect(removeLeadingZeros('-0')).toEqual('0'),
    expect(removeLeadingZeros('-01')).toEqual('-1'),
    expect(removeLeadingZeros('-0.1')).toEqual('-0.1'),
    expect(removeLeadingZeros('-000.1')).toEqual('-0.1'),
    expect(removeLeadingZeros('-1')).toEqual('-1'),
    expect(removeLeadingZeros('-01.0')).toEqual('-1.0')
})
