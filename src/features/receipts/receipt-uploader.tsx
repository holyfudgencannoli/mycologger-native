import { StyleSheet, Text } from "react-native";
import { Surface, TextInput } from "react-native-paper";
import ImagePickerExample from "@components/image-selector";
import CrossPlatformDateTimePicker from "@components/date-time-picker";

export default function UploadReceipt({
    setImage,
    setContentType,
    setReceiptMemo,
    setPurchaseDatetime
}) {
    const onChangeDate = (event: any, selectedDate: Date) => {
        if (selectedDate) setPurchaseDatetime(selectedDate);
    };

    const image = null
    const contentType = ""

    const receiptMemo = ""

    const purchaseDatetime = new Date()

    return (
        <Surface style={styles.surfaceContainer}>
            <Text style={styles.title}>Upload Receipt</Text>        
            <Surface style={styles.surface}>
                <ImagePickerExample
                    image={image}
                    setImage={setImage}
                    contentType={contentType}
                    setContentType={setContentType}
                />
                <TextInput
                    multiline
                    placeholder="Receipt Memo"
                    label="receiptMemo"
                    value={receiptMemo}
                    onChangeText={setReceiptMemo}
                    mode="outlined"
                    style={styles.input}
                />
            </Surface>
                <Text style={styles.title}>Receipt Date & Time</Text>        
            <Surface style={styles.surface}>
                <CrossPlatformDateTimePicker
                    purchaseDatetime={purchaseDatetime}
                    onChangeDate={onChangeDate}
                />
            </Surface>
        </Surface>
    )
}



const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", },
  text: { fontSize: 20, marginBottom: 20 },
  form: {
    backgroundColor: 'rgba(0, 17, 255, 0.3)',
    width:66    
  },
  backgroundImage:{
    paddingBottom: 300
  },
  input: {
    // margin: 8,
    // padding: 8,
    // gap: 16,
    fontSize: 16
  },
  surface: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    // marginBottom: 8
  },
  surfaceBottom: {
    padding: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    marginBottom: 24
  },
  surfaceContainer: {
    padding: 16,
    backgroundColor: 'rgba(56,185,255,0.3)'
  },
  surfaceMetaContainer: {
    backgroundColor: 'rgba(55,255,55,0.4)',
    width:350,
    margin: 'auto',
    marginTop: 16,
  },
  title: {
    fontSize: 24,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
  subtitle: {
    fontSize: 18,
    textAlign:  'center',
    fontWeight: 'bold',
    color: 'red',
    textShadowColor: 'blue',
    textShadowRadius: 16,
  },
measurementBox: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 8, // space between inputs (RN 0.71+)
  paddingHorizontal: 8,
},

measurementInput: {
  flex: 1,          // take equal space
  minWidth: 120,    // never smaller than 120px
  maxWidth: 180,    // optional: never bigger than 180px
},

   measurementContainer: {
    display: 'flex',
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    padding: 10,
  },
  item: {
    width: "30%",        // 3 items per row
    aspectRatio: 1,      // makes it square
    marginBottom: 10,
    backgroundColor: "#4682B4",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  measurementText: {
    color: "white",
    fontWeight: "bold",
  },
  measurementFloatInput: {
    width: 144
  }
});

