import { Background } from "@react-navigation/elements"

export const TypeStyles = (routeName) => ({
    form:{
        title:{
            textAlign: 'center',
            fontSize: 24,
            fontWeight: 'bold',
            textShadowRadius: 16,
            textShadowColor: StyleColors[routeName] || 'black',
            color: 'white'
        },
        subtitle:{
            textAlign: 'center',
            fontSize: 16,
            // fontWeight: 'bold',
            textShadowRadius: 16,
            textShadowColor: StyleColors[routeName] || 'black',
            color: 'white',
            paddingTop: 16,
            paddingBottom: 16,
            alignText: 'justify'
            
        },
        inputFieldLabel: {
            textAlign: 'center',
            fontSize: 18,
            fontWeight: 'bold',
            textShadowRadius: 16,
            textShadowColor:  StyleColors[routeName] || 'black',
            color: 'white',
            padding: 16
        },
        timeFieldLabel: {
            textAlign: 'center',
            fontSize: 16,
            fontWeight: 'bold',
            textShadowRadius: 16,
            textShadowColor:  StyleColors[routeName] || 'black',
            color: 'white',
            // padding: 16
        },
        button: {
            color: StyleColors.buttons.colors[routeName]
        },
        background: {
            BackgroundColor: StyleColors.backgrounds[routeName]
        }
    },
    list: {
        title:{
   
            textAlign:'center',
            fontWeight:'bold',
            fontSize: 28,
            padding: 24,
            lineHeight: 42,
            color: 'white',
            textShadowColor: 'black',
            textShadowRadius: 24
        },
    },
    dataTable: {
        headerView: {
            backgroundColor: StyleColors.headers.backgrounds[routeName],
            borderColor: StyleColors.headers.borders[routeName],
            borderWidth: 2,
            fontWeight: 'bold',
        }, 
        headerText: {
            textAlign: 'center',
            color: 'white',
            textShadowColor: 'black',
            textShadowRadius: 16

        }
    }
})


const StyleColors = {
    "One-Time Tasks": 'rgba(16, 160, 255, 1)',
    "Static Recurring Tasks": 'rgba(1, 160, 16, 1)',
    "Dynamic Recurring Tasks": 'rgba(255, 1, 16, 1)',
    "Limited Opportun. Tasks": 'rgba(122, 16, 255, 1)',
    headers: {
        borders: {
            "One-Time Tasks": 'rgba(1,160,16,0.5)',
            "Static Recurring Tasks": 'rgba(16, 160, 255, 0.5)',
            "Dynamic Recurring Tasks": 'rgba(122,16,255,0.5)',
            "Limited Opportun. Tasks":'rgba(160,1,16,0.5)'
        },
        backgrounds: {
            "One-Time Tasks": 'rgba(16, 160, 255, 0.5)',
            "Static Recurring Tasks": 'rgba(1,160,16,0.5)',
            "Dynamic Recurring Tasks": 'rgba(160,1,16,0.5)',
            "Limited Opportun. Tasks": 'rgba(122,16,255,0.5)',
        }
    },
    buttons: {
        colors: {
            "One-Time Tasks": 'rgba(16, 160, 255, 1)',
            "Static Recurring Tasks": 'rgba(1, 160, 16, 1)',
            "Dynamic Recurring Tasks": 'rgba(255, 1, 16, 1)',
            "Limited Opportun. Tasks": 'rgba(122, 16, 255, 1)',
        }

    },
    backgrounds: {
        "One-Time Tasks": 'rgba(11, 108, 173, 0.5)',
        "Static Recurring Tasks": 'rgba(0, 109, 11, 0.5)',
        "Dynamic Recurring Tasks": 'rgba(94, 0, 10, 0.5)',
        "Limited Opportun. Tasks": 'rgba(77, 13, 155, 0.5)'
    }

}

