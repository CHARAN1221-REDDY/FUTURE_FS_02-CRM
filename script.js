const API = "http://localhost:5000";

let allLeads = [];

/* Add Lead */

async function addLead(){

    const lead = {

        name: document.getElementById("name").value,
        email: document.getElementById("email").value,
        phone: document.getElementById("phone").value,
        source: document.getElementById("source").value,
        notes: document.getElementById("notes").value,
        status:"New"

    };

    await fetch(`${API}/addLead`,{

        method:"POST",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify(lead)

    });

    loadLeads();

}

/* Load Leads */

async function loadLeads(){

    const response = await fetch(`${API}/leads`);

    const data = await response.json();

    allLeads = data;

    displayLeads(data);

    updateCards(data);

}

/* Display Leads */

function displayLeads(data){

    const table = document.getElementById("leadTable");

    table.innerHTML = "";

    data.forEach(lead => {

        let statusClass = "";

        if(lead.status==="New"){
            statusClass="new";
        }

        else if(lead.status==="Contacted"){
            statusClass="contacted";
        }

        else{
            statusClass="converted";
        }

        table.innerHTML += `

        <tr>

            <td>${lead.name}</td>
            <td>${lead.email}</td>
            <td>${lead.phone}</td>
            <td>${lead.source}</td>

            <td>

                <select onchange="updateStatus('${lead._id}', this.value)">

                    <option ${lead.status==="New"?"selected":""}>
                    New
                    </option>

                    <option ${lead.status==="Contacted"?"selected":""}>
                    Contacted
                    </option>

                    <option ${lead.status==="Converted"?"selected":""}>
                    Converted
                    </option>

                </select>

            </td>

            <td>

                <button onclick="deleteLead('${lead._id}')" class="delete-btn">
                    Delete
                </button>

            </td>

        </tr>

        `;

    });

}

/* Update Status */

async function updateStatus(id,status){

    await fetch(`${API}/update/${id}`,{

        method:"PUT",

        headers:{
            "Content-Type":"application/json"
        },

        body:JSON.stringify({status})

    });

    loadLeads();

}

/* Delete Lead */

async function deleteLead(id){

    await fetch(`${API}/delete/${id}`,{

        method:"DELETE"

    });

    loadLeads();

}

/* Search */

function searchLead(){

    const value = document
    .getElementById("search")
    .value
    .toLowerCase();

    const filtered = allLeads.filter(lead =>

        lead.name.toLowerCase().includes(value) ||

        lead.email.toLowerCase().includes(value)

    );

    displayLeads(filtered);

}

/* Dashboard Cards */

function updateCards(data){

    document.getElementById("totalLeads").innerText = data.length;

    const contacted = data.filter(
        lead => lead.status==="Contacted"
    ).length;

    const converted = data.filter(
        lead => lead.status==="Converted"
    ).length;

    document.getElementById("contactedLeads").innerText = contacted;

    document.getElementById("convertedLeads").innerText = converted;

}

loadLeads();