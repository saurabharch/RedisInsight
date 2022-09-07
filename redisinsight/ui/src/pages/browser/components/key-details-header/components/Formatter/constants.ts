import { KeyTypes, KeyValueFormat, ModulesKeyTypes } from 'uiSrc/constants'

export const KEY_VALUE_FORMATTER_OPTIONS = [
  {
    text: 'Unicode',
    value: KeyValueFormat.Unicode,
  },
  {
    text: 'ASCII',
    value: KeyValueFormat.ASCII,
  },
  {
    text: 'Binary',
    value: KeyValueFormat.Binary,
  },
  {
    text: 'HEX',
    value: KeyValueFormat.HEX,
  },
  {
    text: 'JSON',
    value: KeyValueFormat.JSON,
  },
  {
    text: 'Msgpack',
    value: KeyValueFormat.Msgpack,
  },
  {
    text: 'Protobuf',
    value: KeyValueFormat.Protobuf,
  },
  {
    text: 'PHP serialized',
    value: KeyValueFormat.PHP,
  },
  {
    text: 'Java serialized',
    value: KeyValueFormat.JAVA,
  },
]

export const KEY_VALUE_JSON_FORMATTER_OPTIONS = []

export const getKeyValueFormatterOptions = (viewFormat?: KeyTypes | ModulesKeyTypes) => (
  viewFormat !== KeyTypes.ReJSON
    ? [...KEY_VALUE_FORMATTER_OPTIONS]
    : [...KEY_VALUE_FORMATTER_OPTIONS].filter((option) =>
      (KEY_VALUE_JSON_FORMATTER_OPTIONS as Array<any>).indexOf(option.value) !== -1)
)
