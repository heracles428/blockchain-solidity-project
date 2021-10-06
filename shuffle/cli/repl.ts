// Copyright (c) The Diem Core Contributors
// SPDX-License-Identifier: Apache-2.0

// Generated on new project creation. Invoked by shuffle CLI.

// Creates typescript wrappers around the Developer API for easier consumption,
// including endpoints: ledgerInfo, resources, modules, and some of transactions.
// Developer API: https://docs.google.com/document/d/1KEPnGGU3zg_RmN8V4r2ms_MFPwsTMNyK7jCUFygviDg/edit#heading=h.hesw425dw9gz

// deno-lint-ignore-file no-explicit-any
import { green } from 'https://deno.land/x/nanocolors@0.1.12/mod.ts';
import { createRemote } from "https://deno.land/x/gentle_rpc@v3.0/mod.ts";

function highlight(content: string) {
  return green(content);
}

// TODO: Replace all hardcoding with calculated or env retrieved values.
export const projectPath = Deno.env.get("PROJECT_PATH") || "unknown";
export const nodeUrl = 'http://127.0.0.1:8081'
export const senderAddress = "0x24163afcc6e33b0a9473852e18327fa9";
export const privateKeyPath = "/Users/droc/workspace/diem/shuffle/cli/new_account.key";

console.log(`Loading Project ${highlight(projectPath)}`);
console.log(`Connected to Node ${highlight(nodeUrl)}`);
console.log(`Sender Account Address ${highlight(senderAddress)}`);
console.log(`"Shuffle", "TxnBuilder", "Helper" top level objects available`);
console.log(await ledgerInfo());
console.log();

export async function ledgerInfo() {
  const res = await fetch(relativeUrl("/"));
  return await res.json();
}

export async function transactions() {
  const res = await fetch(relativeUrl("/transactions"));
  return await res.json();
}

export async function accountTransactions() {
  const remote = createRemote("http://127.0.0.1:8080/v1");
  return await remote.call(
    "get_account_transactions",
    ["24163afcc6e33b0a9473852e18327fa9", 0, 10, true]
  );
}

export async function resources(addr: string | undefined) {
  if(addr === undefined) {
    addr = senderAddress;
  }
  const res = await fetch(relativeUrl(`/accounts/${addr}/resources`));
  return await res.json();
}

export async function modules(addr: string | undefined) {
  if(addr === undefined) {
    addr = senderAddress;
  }
  const res = await fetch(relativeUrl(`/accounts/${addr}/modules`));
  return await res.json();
}

// Gets the sender address's account resource from the developer API.
// Example payload below:
// {
//   "type": {
//     "type": "struct",
//     "address": "0x1",
//     "module": "DiemAccount",
//     "name": "DiemAccount",
//     "generic_type_params": []
//   },
//   "value": {
//     "sequence_number": "2",
export async function account() {
  const res = await resources(senderAddress);
  return res.
    find(
      (entry: any) => entry["type"]["name"] == "DiemAccount"
    );
}

export async function sequenceNumber() {
  const acc = await account();
  if (acc) {
    return parseInt(acc["value"]["sequence_number"]);
  }
  return null;
}

export async function accounts() {
  return [await account()];
}

export const test = Deno.test;

function relativeUrl(tail: string) {
  return new URL(tail, nodeUrl).href;
}
