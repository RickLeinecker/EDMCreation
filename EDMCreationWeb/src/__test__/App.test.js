import React from 'react';
import { shallow, mount } from 'enzyme';
import App from '../App';
import Songs from '../components/Songs';
import NavBar from '../components/NavBar';

describe('App', () => {
    it('renders without crashing', () => {
        shallow(<App />);
    });
});

describe('Songs', () => {
    const data = {
        songs: [
            {
                "_id": "6065153ed1c23b855194229c",
                "favorited_date": null,
                "composition_id": "6065153ed1c23b855194229c",
                "user_id": "6065153ed1c23b855194229c",
                "title": "Techno Song",
                "username": "tony",
                "num_comments": 1,
                "likes": 3,
                "comments": [
                    {
                        "_id": "60652fa27eced78ad691a6c4",
                        "username": "edmguy",
                        "user_id": "606525a77eced78ad691a6a6",
                        "comment": "Great song",
                        "created_on": "2021-04-01T02:27:46.115Z"
                    }
                ],
                "genre": "Techno",
                "path": "https://res.cloudinary.com/dxe19l65j/raw/upload/v1617237310/compositions/bpyvmwnizbb0f94obyp2",
                "listens": 66,
                "date": "2021-04-01T00:35:10.921Z",
                "image_id": null
            }
        ]
    }

    it('accepts songs props', () => {
        const wrapper = mount(<Songs songs={data.songs} />);
        expect(wrapper.props().songs).toEqual(data.songs);
    });

    it('displays no songs', () => {
        const wrapper = mount(<Songs />);
        expect(wrapper.text()).toEqual("There are no songs here. \xa0 ‘︿’");
    });
});