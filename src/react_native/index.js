import CborReader from 'cbor-js';
import { Buffer } from 'buffer';
import PubNubCore from '../core/pubnub-common';
import Networking from '../networking';
import { decode } from '../core/components/base64_codec';
import { TextDecoder, TextEncoder } from 'text-encoding-utf-8';
import 'react-native-get-random-values';
import { stringifyBufferKeys } from '../core/components/stringify_buffer_keys';
import Cbor from '../cbor/common';
import { del, get, post, patch } from '../networking/modules/web-node';
import { getfile, postfile } from '../networking/modules/react_native';

import PubNubFile from '../file/modules/react-native';
import { stringifyBufferKeys } from '../web';
import { CryptoModule, LegacyCryptor, AesCbcCryptor } from '../crypto/modules/WebCryptoModule/webCryptoModule';

global.Buffer = global.Buffer || Buffer;
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

export default class extends PubNubCore {
  constructor(setup) {
    setup.cbor = new Cbor((arrayBuffer) => stringifyBufferKeys(CborReader.decode(arrayBuffer)), decode);

    setup.PubNubFile = PubNubFile;

    setup.networking = new Networking({
      del,
      get,
      post,
      patch,
      getfile,
      postfile,
    });
    setup.sdkFamily = 'ReactNative';
    setup.ssl = true;
    setup.initCryptoModule = (cryptoConfiguration) => {
      return new CryptoModule({
        default: new LegacyCryptor({
          cipherKey: cryptoConfiguration.cipherKey,
          useRandomIVs: cryptoConfiguration.useRandomIVs,
        }),
        cryptors: [new AesCbcCryptor({ cipherKey: cryptoConfiguration.cipherKey })],
      });
    };
    super(setup);
  }
}
