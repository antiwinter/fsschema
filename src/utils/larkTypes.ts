import React from 'react';
import { FieldType } from '@lark-base-open/js-sdk';
import {
  FontSizeOutlined,
  NumberOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
  CalendarOutlined,
  UserOutlined,
  LinkOutlined,
  FunctionOutlined,
  SearchOutlined,
  BarcodeOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  PaperClipOutlined,
  GlobalOutlined,
  MailOutlined,
  PhoneOutlined,
  TeamOutlined,
  SafetyCertificateOutlined,
  FileTextOutlined
} from '@ant-design/icons';

/**
 * Maps Lark Base field types to SQL-like type strings for display.
 */
export const mapLarkTypeToSQL = (type: FieldType): string => {
  switch (type) {
    case FieldType.Text:
      return 'VARCHAR';
    case FieldType.Number:
      return 'NUMERIC';
    case FieldType.SingleSelect:
      return 'ENUM';
    case FieldType.MultiSelect:
      return 'SET';
    case FieldType.DateTime:
      return 'DATETIME';
    case FieldType.Checkbox:
      return 'BOOLEAN';
    case FieldType.User:
      return 'USER_REF';
    case FieldType.Phone:
      return 'VARCHAR(20)';
    case FieldType.Url:
      return 'VARCHAR(2048)';
    case FieldType.Attachment:
      return 'BLOB_REF';
    case FieldType.SingleLink:
      return 'FK(1:1)';
    case FieldType.DuplexLink:
      return 'FK(M:N)';
    case FieldType.Lookup:
      return 'LOOKUP';
    case FieldType.Formula:
      return 'FORMULA';
    case FieldType.CreatedTime:
      return 'TIMESTAMP(C)';
    case FieldType.ModifiedTime:
      return 'TIMESTAMP(M)';
    case FieldType.CreatedUser:
      return 'USER_REF(C)';
    case FieldType.ModifiedUser:
      return 'USER_REF(M)';
    case FieldType.AutoNumber:
      return 'SERIAL';
    case FieldType.Barcode:
      return 'BARCODE';
    case FieldType.Location:
      return 'GEOMETRY';
    case FieldType.Currency:
      return 'MONEY';
    case FieldType.Progress:
      return 'FLOAT';
    case FieldType.Rating:
      return 'INT';
    case FieldType.Email:
      return 'EMAIL';
    case FieldType.GroupChat:
      return 'CHAT_REF';
    case FieldType.Denied:
      return 'DENIED';
    default:
      return `UNKNOWN(${type})`;
  }
};

/**
 * Returns an Ant Design icon component for the given field type.
 */
export const getFieldIcon = (type: FieldType): React.ReactNode => {
  switch (type) {
    case FieldType.Text:
      return React.createElement(FontSizeOutlined);
    case FieldType.Number:
    case FieldType.AutoNumber:
    case FieldType.Rating:
    case FieldType.Progress:
      return React.createElement(NumberOutlined);
    case FieldType.SingleSelect:
    case FieldType.MultiSelect:
      return React.createElement(UnorderedListOutlined);
    case FieldType.Checkbox:
      return React.createElement(CheckSquareOutlined);
    case FieldType.DateTime:
    case FieldType.CreatedTime:
    case FieldType.ModifiedTime:
      return React.createElement(CalendarOutlined);
    case FieldType.User:
    case FieldType.CreatedUser:
    case FieldType.ModifiedUser:
      return React.createElement(UserOutlined);
    case FieldType.SingleLink:
    case FieldType.DuplexLink:
      return React.createElement(LinkOutlined);
    case FieldType.Lookup:
      return React.createElement(SearchOutlined);
    case FieldType.Formula:
      return React.createElement(FunctionOutlined);
    case FieldType.Attachment:
      return React.createElement(PaperClipOutlined);
    case FieldType.Url:
      return React.createElement(GlobalOutlined);
    case FieldType.Email:
      return React.createElement(MailOutlined);
    case FieldType.Phone:
      return React.createElement(PhoneOutlined);
    case FieldType.GroupChat:
      return React.createElement(TeamOutlined);
    case FieldType.Location:
      return React.createElement(EnvironmentOutlined);
    case FieldType.Barcode:
      return React.createElement(BarcodeOutlined);
    case FieldType.Currency:
      return React.createElement(DollarOutlined);
    case FieldType.Denied:
      return React.createElement(SafetyCertificateOutlined);
    default:
      return React.createElement(FileTextOutlined);
  }
};
