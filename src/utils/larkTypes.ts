import { FieldType } from '@lark-base-open/js-sdk';

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
      return 'USER_REF (FK)';
    case FieldType.Phone:
      return 'VARCHAR(20)';
    case FieldType.Url:
      return 'VARCHAR(2048)'; // Standard URL max length
    case FieldType.Attachment:
      return 'BLOB_REF'; // References to files
    case FieldType.SingleLink:
      return 'FOREIGN KEY (1:1)';
    case FieldType.DuplexLink: // Bi-directional link
      return 'FOREIGN KEY (M:N)';
    case FieldType.Lookup:
      return 'LOOKUP';
    case FieldType.Formula:
      return 'FORMULA';
    case FieldType.CreatedTime:
      return 'TIMESTAMP (Created)';
    case FieldType.ModifiedTime:
      return 'TIMESTAMP (Modified)';
    case FieldType.CreatedUser:
      return 'USER_REF (Creator)';
    case FieldType.ModifiedUser:
      return 'USER_REF (Modifier)';
    case FieldType.AutoNumber:
      return 'SERIAL';
    case FieldType.Barcode:
      return 'VARCHAR (Barcode)';
    case FieldType.Location:
      return 'GEOMETRY (Point)';
    case FieldType.Currency:
      return 'DECIMAL (Currency)';
    case FieldType.Progress:
      return 'FLOAT (Progress)';
    case FieldType.Rating:
      return 'INT (Rating)';
    case FieldType.Email:
      return 'VARCHAR (Email)';
    case FieldType.GroupChat:
      return 'CHAT_REF';
    case FieldType.Denied:
      return 'DENIED'; // No permission
    default:
      return `UNKNOWN(${type})`;
  }
};

