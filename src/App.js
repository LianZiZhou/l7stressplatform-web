import { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

function App() {
  const [statsMessages, setStatsMessages] = useState([]);

  function setWebsocket() {
    const socket = new WebSocket('wss://socket-api-l7.mtf.is/api/socket?channel=watch:all');
    socket.onmessage = (message) => {
        const data = JSON.parse(message.data);
        setStatsMessages((oldMessages) => [...oldMessages, data.data].slice(-30));
    };
    socket.onclose = () => {
        setTimeout(() => {
            setWebsocket();
        }, 1000);
    };
    socket.onerror = () => {
        setTimeout(() => {
            setWebsocket();
        }, 1000);
    };
  }

  console.log(statsMessages)

  const [bgImage, setBgImage] = useState(
      window.innerWidth < 800 ? "url('/src/img/108932779_p0.png')" : "url('/src/img/105463056_p0.png')"
  );

  const handleResize = () => {
    setBgImage(window.innerWidth < 800 ? "url('/src/img/108932779_p0.png')" : "url('/src/img/105463056_p0.png')");
  }

  useEffect(() => {
    window.addEventListener("resize", handleResize);

    setWebsocket();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

    function formatTime(time) {
        const date = new Date(time);
        const hour = date.getHours();
        let minute = date.getMinutes();
        if (minute < 10) minute = `0${minute}`;
        let second = date.getSeconds();
        if (second < 10) second = `0${second}`;
        return `${hour}:${minute}:${second}`;
    }

    function getCategory() {
        const cate = [];
        for (let i = 0; i < statsMessages.length; i++) {
            cate.push(formatTime(statsMessages[i].time));
        }
        return cate;
    }

    function getData() {
        const data = [];
        for (let i = 0; i < statsMessages.length; i++) {
            data.push(statsMessages[i].get + statsMessages[i].post);
        }
        return data;
    }

    const options = {
        grid: { top: 8, right: 8, bottom: 24, left: 36 },
        xAxis: {
            type: 'category',
            data: getCategory(),
        },
        yAxis: {
            type: 'value',
        },
        series: [
            {
                data: getData(),
                type: 'line',
                smooth: true,
            },
        ],
        tooltip: {
            trigger: 'axis',
        }
    };

  return (
      <>
          <dialog id="usageModal" className="modal">
              <div className="modal-box">
                  <form method="dialog">
                      <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                  </form>
                  <h3 className="font-bold text-lg">Usage🎯</h3>
                  <p className="py-4">
                      Just attack the targets below and view the 'Stats📈'.
                        <br/>
                        <br/>
                      1.Fastly Global CDN<br /><a rel="noreferrer" target="_blank" href="https://load-worker.l7.mtf.is/">load-worker.l7.mtf.is</a><br />
                      2.Cloudflare without Firewall<br /><a rel="noreferrer" target="_blank" href="http://cloudflare-load-worker-l7.mtf.fan/">cloudflare-load-worker-l7.mtf.fan</a><br /><br />
                      Both HTTP and HTTPS are enabled.<br />
                      All the targets accept 'GET' and 'POST' requests and response 'ok' with status code 200.
                  </p>
              </div>
          </dialog>
        <div className="navbar bg-base-100 fixed z-50">
          <div className="flex-1">
            <a className="btn btn-ghost normal-case text-xl" href="#">MtF L7 STP⚡</a>
          </div>
          <div className="flex-none mx-2">
            <ul className="menu menu-horizontal px-1">
              <li><a rel="noreferrer" target="_blank" href="https://github.com/LianZiZhou/L7StressPlatform">GitHub</a></li>
            </ul>
          </div>
        </div>
        <div className="hero min-h-screen bg-base-200" style={{backgroundImage: `linear-gradient(rgba(229,231,235,0.6), rgba(229,231,235,0.6)), ${bgImage}`}}>
          <div className="hero-content text-center">
            <div className="max-w-md">
              <h1 className="text-5xl font-bold">MtF <br/>L7 Stress Platform</h1>
              <p className="py-6">Minimal build⚡<br />Fast scaled⚡<br />Carrying billions⚡<br /><br />Open Source with ♥<br />NodeJS / Fastify / Redis / Edge Load Balance</p>
              <button onClick={() => {
                    document.getElementById('stats').scrollIntoView({behavior: 'smooth'});
              }} className="btn btn-primary">Stats📈</button><button onClick={()=>document.getElementById('usageModal').showModal()} className="btn btn-primary mx-2">Usage🎯</button>
            </div>
          </div>
            <p className="absolute bottom-0.5 right-1 text-xs">{
                bgImage === "url('/src/img/105463056_p0.png')" ?
                (<a rel="noreferrer" target="_blank" href="https://www.pixiv.net/artworks/105463056">Pixiv@Vardan 始源／終焉</a>) :
                    ((<a rel="noreferrer" target="_blank" href="https://www.pixiv.net/artworks/108932779">Pixiv@UmenoShii 血掟テキサス</a>))}</p>
        </div>
          <div className="py-12 bg-white" id="stats">
              <ReactECharts option={options} />
          </div>
      </>
  );
}

export default App;
