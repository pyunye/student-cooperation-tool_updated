import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from "axios";
import userImage from "./images/user.svg"
import "./project.css";
import Footer from "./footer";
import {domain} from "./domain";
import "./scrollbar.css"
import "./card.css"
import "./customModal.css"
import "./paginationButton.css"
import "./buttons.css"
import { useNavigate } from 'react-router-dom';
import "./juaFont.css"
import searchIcon from "./images/search.svg";
import emptyBox from "./images/emptyBox.svg"

const RoomList = ({setCreateModal}) => {
    const [rooms, setRooms] = useState({num: 0, roomList: []});
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 상태 추가
    const navigate = useNavigate();
    // 방 목록 가져오기 (페이지에 따라 호출)
    const fetchRooms = (page) => {
        axios
            .get(domain + `/api/v1/rooms?page=${page}`)
            .then((res) => {
                console.log(res.data);
                setRooms(res.data.data);
                setCurrentPage(page); // 현재 페이지 업데이트
            })
            .catch(() => {
                console.log("Failed to load rooms");
            });
    };

    // 초기 로드 시 첫 페이지 데이터 가져오기
    useEffect(() => {
        fetchRooms(0); // 첫 페이지로 초기화
    }, []);

    const deleteRoom = (roomId) => {
        axios
            .delete(`${domain}/api/v1/rooms`, {
                data: {
                    roomId,
                },
            })
            .then((res) => {
                const roomCard = document.getElementById('room'+`${roomId}`);
                fetchRooms(currentPage)
            })
            .catch(() => {
                alert("프로젝트를 삭제하지 못했습니다.")
                console.log("Failed to delete room");
            });
    }

    function verifyPasswordAndEnterRoom(roomId){
        const password = document.getElementById("roomPasswordInput").value
        const data = {
            roomId,
            password
        }
        axios
            .post(`${domain}/api/v1/rooms/enter-room`,data,{ "Content-Type": "application/json"})
            .then((res) =>{
                const isCorrect = res.data.data
                if(isCorrect){
                    //비밀 번호가 맞다면, 방을 입장
                    navigate('/topic', {state : {roomId}});
                    closeEnterModal()
                }
            })
            .catch(() =>{
                const passwordInvalidDiv = document.getElementById("passwordInvalidDiv");
                passwordInvalidDiv.innerHTML = '<span style="color:red;">해당 비밀번호는 틀렸습니다. 다시 입력해주세요.</span>'
            })
    }

    function closeEnterModal(){
        const passwordModalDiv = document.getElementById("passwordModalDiv");
        passwordModalDiv.remove()
    }

    function openRoomModal(roomId){
        const enterRoomModalDiv = document.getElementById("enterRoomModalDiv")
        enterRoomModalDiv.innerHTML += `
                <div class="modal_overlay" id="passwordModalDiv">
                    <div class="modal_content" style="text-align: center;">
                        <button class="close_button" id="closeModalButton">X</button>
                        <div id="passwordInvalidDiv"></div>
                        <label class="modal_label">비밀번호</label>
                        <input class="modal_input" id="roomPasswordInput" type="password"/>
                        <button id="verifyRoomButton">입장</button>
                    </div>
                </div>
            `
        document.getElementById("closeModalButton").onclick = closeEnterModal;
        document.getElementById("verifyRoomButton").onclick = () => verifyPasswordAndEnterRoom(roomId);
    }

    return (
        <div className="room_list">
            <div id="newRoomDiv" className="newRoom-container"></div>
            <div id="barDiv"></div>
            <div className="header-container">
                <h2 id="roomsListH">프로젝트 목록( 참여한 프로젝트 : {rooms.num} )
                    <form className="create_box" onSubmit={(e) => e.preventDefault()}>
                        <div className="button-container">
                            <button className="create_button" type="submit" onClick={() => setCreateModal(true)}>
                                +
                            </button>
                        </div>
                    </form>
                </h2>
            </div>
            <div>
                {rooms.num > 0 ? (
                    <>
                        <div className="card-container">
                            {rooms.rooms.map((room) => {
                                const capColors = ["pink-cap", "green-cap", "orange-cap"];
                                const randomCapClass = capColors[Math.round(Math.random() * capColors.length)];
                                return (
                                    <div id={"room" + room.roomId} className="card">
                                        <div className={`image-cap ${randomCapClass}`}>
                                            {room.title}
                                        </div>
                                        <div className="card-body">
                                        <span style={{fontSize: "small", justifyContent: "end", color: "white"}}>
                                            참가자 : {room.participationNum}
                                        </span>
                                            <h3 className="card-title">주제 : {room.topic}</h3>
                                            <div className="button-group">
                                                <button className="card-button"
                                                        onClick={() => openRoomModal(room.roomId)}>
                                                    입장하기
                                                </button>
                                                <button className="card-red-button"
                                                        onClick={() => deleteRoom(room.roomId)}>
                                                    삭제하기
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        <div id="paginationButtonGroup" className="pagination-container">
                            <button className="pagination-button" onClick={() => fetchRooms(rooms.firstPage - 1)}
                                    disabled={currentPage === rooms.firstPage - 1}>
                                맨 처음
                            </button>
                            <div id="paginationButtonGroup" className="pagination-container">
                                {/* 여기서 firstPage부터 lastPage까지 버튼 생성 */}
                                {Array.from(
                                    {length: rooms.lastPage - rooms.firstPage + 1},
                                    (_, i) => rooms.firstPage + i
                                ).map((page) => (
                                    <button className="pagination-button" onClick={() => fetchRooms(page - 1)}
                                            disabled={currentPage === page - 1}>
                                        {page}
                                    </button>
                                ))}
                            </div>
                            <button onClick={() => fetchRooms(rooms.lastPage - 1)} className="pagination-button"
                                    disabled={currentPage === rooms.lastPage - 1}>
                                마지막
                            </button>
                        </div>
                    </>
                ) : <h1 style={{textAlign: "center"}} id="notExistH">
                    <div>
                        <img src={emptyBox} height="200" width="200"/>
                    </div>
                    아직 참여하는 프로젝트가 없네요. 프로젝트에 참여해볼까요?
                </h1>}
            </div>
            <div id="enterRoomModalDiv" className=""></div>
        </div>
    );
};

const Project = () => {
    const [createmodal, setCreateModal] = useState(false);
    const [roomData, setRoomData] = useState({num: 0, rooms: []});
    const [result, setResult] = useState({num: 0, members: []}); // 초대할 친구 정보
    const [participant, setParticipant] = useState({num: 0, members: []}); // 이미 초대된 친구들 정보

    const [enterRoomId, setEnterRoomId] = useState(0)
  const [searchFriend, setSearchFriend] = useState("");
  const [page, setPage] = useState(0);
  const [searchModal, setSearchModal] = useState(false);
  const [enterModal, setEnterModal] = useState(false);
  const [friendModal, setFriendModal] = useState(false);
  const [deleteRoomId, setDeleteRoomId] = useState(null);
  const [searched, setSearched] = useState(false);
  const [term, setTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState(term);
  const navigate = useNavigate();

    useEffect(() => {
        const roomCardToDelete = document.querySelector(`li[key="${deleteRoomId}"]`);
        if (roomCardToDelete) {
            roomCardToDelete.remove();
        }
    }, [deleteRoomId]);

    useEffect(() => {
        const timer = setTimeout(() =>
        setTerm(debouncedTerm), 500);
        return () => clearTimeout(timer);
    }, [debouncedTerm]);

    useEffect(() => {  
        if (term !== '') {
            handleFriend(term);
        } else {
            clearResults();
        }
    }, [term]);

    useEffect(()=>{
    axios.get(`${domain}/api/v1/friends/search?relation=true&name=${searchFriend}`)
        .then((res) => {
            const allResults = res.data.data.members; // 검색 결과
            console.log(allResults);
            const filteredResults = participant.num > 0
                ? allResults.filter((result) =>
                    !participant.members.some((member) => member.id === result.id)
                )
                : allResults;
            console.log(filteredResults);
            setResult({num: filteredResults.length, members: filteredResults});
        })
        .catch((reason) => {
            console.log("Failed to search friend");
            console.log(reason);
        });
    }, [searched])

    const clearResults = () => setResult({num: 0, members: []});
    const handleDeleteRoom = (roomId) => {
        axios
            .delete(`${domain}/api/v1/rooms`, {
                data: {
                    roomId,
                },
            })
            .then(() => {
                    setDeleteRoomId(roomId);
            })
            .catch(() => {
                console.log("Failed to delete room");
            });
    };

    const handleSearch = ({page}) => {
        const searchTitle = document.getElementById("roomSearchInput").value;
        axios
            .get(`${domain}/api/v1/rooms/search?title=${searchTitle}&page=${page}`)
            .then((res) => {
                setRoomData(res.data.data);
                setSearchModal(true);  // 모달 열기
            })
            .catch(() => {
                console.log("Failed to search project.");
            });
    };

    const enterRoom = (roomId) =>{
        closeSearchModal()
        setEnterRoomId(roomId)
        setEnterModal(true)
    }

    const verifyPasswordAndEnterRoom = (roomId) =>{
        const password = document.getElementById("roomPasswordInput").value
        const data = {
            roomId,
            password
        }
        axios
            .post(`${domain}/api/v1/rooms/enter-room`,data,{ "Content-Type": "application/json"})
            .then((res) =>{
                const isCorrect = res.data.data
                if(isCorrect){
                    //비밀 번호가 맞다면, 방을 입장
                    navigate('/topic', {state : {roomId}});
                    closeEnterModal()
                }
            })
            .catch(() =>{
                const passwordInvalidDiv = document.getElementById("passwordInvalidDiv");
                passwordInvalidDiv.innerHTML = '<span style="color:red;">해당 비밀번호는 틀렸습니다. 다시 입력해주세요.</span>'
            })
    }

    // 이전 페이지 버튼 클릭
    const handlePrevPage = () => {
        if (page > 0) {
            setPage((prevPage) => prevPage - 1);
            handleSearch({ page: page - 1 });
        }
    };

    // 다음 페이지 버튼 클릭
    const handleNextPage = () => {
        setPage((prevPage) => prevPage + 1);
        handleSearch({ page: page + 1 });
    };


    const handleCreateClick = () => {
        const passwordInput = document.getElementById("createRoomPassword");
        const roomTitleInput = document.getElementById("createRoomTitle");
        const errorMessageDiv = document.getElementById('createRoomErrorMessage');

        const password = passwordInput.value.trim();
        const roomTitle = roomTitleInput.value.trim();

        // 에러 메시지 초기화 및 숨김
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';

        axios
            .post(`${domain}/api/v1/rooms`, {
                title: roomTitle,
                password,
                participation: participant.members.map((member) => member.id)
            })
            .then((res) => {
                const updatedRoom = res.data.data;
                console.log("Succeeded to create project.");
                closeCreateModal();
                createRoomDiv(updatedRoom);
            })
            .catch((error) => {
                // 에러 처리
                if (error.response) {
                    switch (error.response.status) {
                        case 400:  // Bad Request
                            errorMessageDiv.textContent = '제목과 비밀번호를 모두 입력해주세요.';
                            break;
                        case 409:  // Conflict (Data Integrity Violation)
                            errorMessageDiv.textContent = `이미 '${roomTitle}' 프로젝트가 존재합니다.`;
                            break;
                        default:
                            errorMessageDiv.textContent = '프로젝트 생성 중 오류가 발생했습니다.';
                    }
                    errorMessageDiv.style.display = 'block';
                } else {
                    console.error("Error creating project:", error);
                    errorMessageDiv.textContent = '네트워크 오류가 발생했습니다.';
                    errorMessageDiv.style.display = 'block';
                }
            });
    };

    function createRoomDiv(updatedRoom){
        const newRoomDiv = document.getElementById('newRoomDiv')
        console.log(`newRoomDiv: ${newRoomDiv}`);
        if(newRoomDiv.querySelector('h2') === null){
            newRoomDiv.innerHTML += `<h2>새로운 프로젝트</h2>`
        }
        const barDiv = document.querySelector('#barDiv');
        const notExistH = document.querySelector('#notExistH');

        if (notExistH) {
            let roomsListH = document.querySelector('#roomsListH')
            roomsListH.parentNode.removeChild(roomsListH)
            notExistH.parentNode.removeChild(notExistH)
        } else{
            barDiv.setAttribute("class","divider-bar")
        }
        const capColors = ["pink-cap", "green-cap", "orange-cap"];
        const randomCapClass = capColors[Math.round(Math.random() * capColors.length)];
        newRoomDiv.innerHTML += `<li key="${updatedRoom.roomId}">
            <div class="card">
                <div class="image-cap ${randomCapClass}">${updatedRoom.title}</div>
                <div class="card-body">
                    <h3 class="card-title">미정</h3>
                     <div class="button-group">
                     <button class="card-button" id="enterRoomButton-${updatedRoom.roomId}">
                        입장하기
                    </button>
                    <button class="card-red-button" id="deleteRoomButton-${updatedRoom.roomId}">
                        삭제하기
                    </button>
                    </div>
                </div>
            </div>
        </li>
    `;

        document.getElementById(`enterRoomButton-${updatedRoom.roomId}`).addEventListener('click', () => enterRoom(updatedRoom.roomId));
        document.getElementById(`deleteRoomButton-${updatedRoom.roomId}`).addEventListener('click', () => handleDeleteRoom(updatedRoom.roomId));

    }


   const closeCreateModal = () => {

    setCreateModal(false);
    setRoomData({num:0, rooms: []});
    setParticipant({num: 0, members: []});
  };

  const closeSearchModal = () => {
    setPage(0);
    setSearchModal(false);
    setRoomData({num:0, rooms: []});
  }

  const closeFriendModal = () => {
      setSearchFriend("");
      setFriendModal(false);
  }

  const closeEnterModal = () => {
      setEnterRoomId(0)
      setEnterModal(false)
  }

  const handleFriendList = () => {
    axios.get(`${domain}/api/v1/friends`)
        .then((res) => {
            const allResults = res.data.data.members; // 검색 결과
            console.log(allResults);
            const filteredResults = participant.num > 0
                ? allResults.filter((result) =>
                    !participant.members.some((member) => member.id === result.id)
                )
                : allResults;
            console.log(filteredResults);
            setResult({num: filteredResults.length, members: filteredResults})
          setFriendModal(true);
        })
        .catch(() => {
          console.log("Failed to list friend")
        })
  }

  /* 참여할 유저 ( 친구 상태 ) 검색 */
  const handleFriend = (value) => {
      setSearchFriend(value.toLowerCase());
      setSearched((prev)=>!prev);
  };


  const addResult = (result, isSearch) => {
    setParticipant(prev => ({ num: prev.num + 1, members: [...prev.members, result ]})); // 참가자들 리스트 추가
      setResult((prev) => ({
          num: prev.num - 1,
          members: prev.members.filter((member) => member !== result)
      }))};

  const handleRemoveParticipant = (email) => {
    setParticipant((prev) => ({
        num: prev.num - 1, // num 값 감소
        members: prev.members.filter((member) => member.email !== email),
    }));
  };
 

  const ParticipantList = () => {

    return (
      <div className="participant_list">
        <h2>팀원 목록</h2>
        {participant.num > 0 ? (
            participant.members.map((participant) => (
                <div key={participant.email} className="room_card">
                    <img src={participant.profile || userImage} alt="프로필"/>
                    <h2>{participant.nickname}</h2>
                    <button onClick={() => handleRemoveParticipant(participant.email)}>
                        X
                    </button>
                </div>
            ))
        ) : <h3>선택한 팀원이 없습니다.</h3>}
      </div>
    );
  }
        return (
            <div className="container">
                <Footer/>
                <main>
                    <form className="search_box" onSubmit={(e) => e.preventDefault()}>
                        <input id="roomSearchInput" className="project_search_txt" type="text"
                               placeholder="프로젝트 이름을 입력하세요."/>
                        <button className="search_button" type="submit" onClick={() => handleSearch()}>
                            <img src={searchIcon}/>
                        </button>
                    </form>
                        <RoomList setCreateModal={setCreateModal}/>
                        {searchModal && (
                            <div className="add_project_container">
                                <div className="modal_overlay" onClick={closeSearchModal}>
                                    <div className="modal_content" onClick={(e)=> e.stopPropagation()}>
                                        <button className="close_button" onClick={() => closeSearchModal()}>
                                            X
                                        </button>
                                        <div className="room_grid scrollbar">
                                            {roomData.num > 0 ? (
                                                <>
                                                    <div className="card-container">
                                                        {roomData.rooms.map((room) => {
                                                            // 랜덤 배경색 클래스 설정
                                                            const capColors = ["pink-cap", "green-cap", "orange-cap"];
                                                            const randomCapClass = capColors[Math.round(Math.random() * capColors.length)];

                                                            return (
                                                                <div key={room.roomId} className="card">
                                                                    {/* 동적으로 랜덤 클래스 추가 */}
                                                                    <div
                                                                        className={`image-cap ${randomCapClass}`}>{room.title}</div>
                                                                    <div className="card-body">
                                                                        <h3 className="card-title">{room.topic}</h3>
                                                                        <button className="card-button"
                                                                                onClick={() => enterRoom(room.roomId)}>
                                                                            참여하기
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <div style={{textAlign: 'center'}} className="pagination-container">
                                                        <button onClick={handlePrevPage} className="pagination-button"
                                                                disabled={page === 0}>
                                                            이전
                                                        </button>
                                                        <button onClick={handleNextPage} className="pagination-button"
                                                                disabled={roomData.last}>
                                                            다음
                                                        </button>
                                                    </div>
                                                </>
                                            ) : <h2 style={{textAlign: "center"}} id="notExistProjectH">
                                                검색한 프로젝트가 존재하지 않습니다.</h2>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {createmodal && (
                            <div className="modal_overlay" onClick={() => setCreateModal(false)}>
                                <div onClick={(e) => e.stopPropagation()} className="create_modal_content">
                                    <button className="close_button" onClick={() => closeCreateModal()}>
                                        X
                                    </button>
                                    <div
                                        id="createRoomErrorMessage"
                                        className="error-message"
                                        style={{
                                            color: 'red',
                                            textAlign: 'center',
                                            marginTop: '10px',
                                            display: 'none'  // 초기에는 숨김
                                        }}
                                    ></div>
                                    <div className="modal_body">
                                        <div className="modal_section">
                                            <label className="modal_label">방 제목</label>

                                            <input className="modal_input" id="createRoomTitle" type="text"
                                            />
                                        </div>

                                        <div className="modal_section">
                                            <label className="modal_label">비밀번호</label>
                                            <input className="modal_input" id="createRoomPassword" type="password"
                                            />
                                        </div>
                                    </div>
                                    <div className="add_friend">
                                        <ParticipantList/> {/* 참가할 친구 리스트 */}
                                        <button className="common-button" onClick={() => {
                                            handleFriendList()
                                        }}>
                                            +
                                        </button>
                                    </div>
                                    <button className="common-button" onClick={() => handleCreateClick()}>생성</button>
                                </div>
                            </div>
                        )}
                </main>

                {enterModal && (
                    <div className="enter_modal_overlay" onClick={closeEnterModal}>
                        <div className="enter_modal_content" style={{textAlign: "center"}} onClick={(e)=> e.stopPropagation()}>
                            <button className="close_button" onClick={() => closeEnterModal()}>
                      X
                  </button>
                  <div id="passwordInvalidDiv"></div>
                  <label className="enter_modal_label">비밀번호</label>
                  <input className="enter_modal_input" id="roomPasswordInput" type="password" placeholder="비밀번호를 입력해주세요."/>
                  <button className="enter_button" onClick={() => verifyPasswordAndEnterRoom(enterRoomId)}> 입장 </button>
              </div>
          </div>
        )}

        {friendModal && (
            <div className="friend_overlay" onClick={()=> closeFriendModal()}>
                <div onClick={(e)=> e.stopPropagation()} className="friend_modal">
                <input
                    className="friend_search_txt"
                    type="text"
                    placeholder="친구 이름을 입력하세요."
                    onChange={(e) => setDebouncedTerm(e.target.value)}
                    value={debouncedTerm}
                />
                    <button className="close_button" onClick={() => closeFriendModal()}>
                        X
                    </button>
                <div className="friend_list">
                    {result.num > 0 ? (
                        result.members.map((member) => (
                            <div key={member.email} className="friend_card">
                                <img src={member.profile || userImage} alt="프로필"/>
                                <h2>{member.nickname}</h2>
                                <button className="add_result_button"
                                    onClick={() => addResult(member)}> 초대
                                </button>
                            </div>
                        ))
                    ) : <h2>친구가 없습니다.</h2>}
                </div>
                </div>
            </div>
        )}``
    </div>
  );
};


export default Project;
