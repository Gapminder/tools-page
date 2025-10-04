import { supabaseClient } from "./../../auth/supabase.service";


export async function accessControlDialogCreate({scope, resource}){
  d3.select(".admin-page").classed("blurry", true)
  const container = d3.select(".access-control-dialog")
    .style("visibility", "visible")
    .html("");

  container.append("div").attr("class", "blur")
  const box = container.append("div").attr("class", "box")

  box.append("div").attr("class", "header")
    .text(`${resource} ${scope} access`)
    
  box.append("div").attr("class", "closecross").text("╳")
    .on("click", () => accessControlDialogCancel())

  const content = box.append("div").attr("class", "content");
  const msg = box.append('div').attr('class', 'form-msg');



  const { data, error } = await supabaseClient.rpc('list_acl', { _scope: scope, _resource: resource })

  if (error) {
    console.error(error);
    msg.attr("class", "form-msg is-error").text(error);
  }

  if (data) {
    const table = content.append("table").attr("class", "admin-table");
    function emojifyLevel(level){
      return (level === "reader" ? "👀" : level === "editor" ? "✏️" : level === "owner" ? "👑" : "") + " " + level;
    }

    table.append("tr")
      .each(function(){
        const rowEl = d3.select(this);
        rowEl.append("th").text("Email")
        rowEl.append("th").text("Granted by")
        rowEl.append("th").text("Level")
        rowEl.append("th").text("Revoke access")
      })
    table.selectAll("tr.item")
      .data(data)
      .enter().append("tr")
      .attr("class", "item")
      .each(function(row){
        const rowEl = d3.select(this);
        rowEl.append("td").text(row.email);
        rowEl.append("td").text(row.parent);
        rowEl.append("td").text(emojifyLevel(row.level));
        rowEl.append("td").append("span").text("❌")
          .attr("class", "button delete")
          .on("click", async () => {
            const { error } = await supabaseClient.rpc('revoke_acl_by_email', {
              _email: row.email,
              _scope: scope,
              _resource: resource
            })
  
            if (error) {
              msg.attr('class', 'form-msg is-error').text(error.message || 'Insert failed.');
            } else {
              msg.attr('class', 'form-msg is-ok').text('Access Revoked');
  
              setTimeout(() => accessControlDialogCreate({scope, resource}), 1000);
            }
          });
      })
   
    const addItemButton = content.append("div").attr("class", "button addnew").text("✚ Grant access")
      .on("click", () => {
        addItemButton.style("visibility", "hidden");

        const form = content.append('form').attr('class', 'form');

        form.append('div').attr('class', 'form-row').text("The invited user needs to be already registered in the service. Invitations are not supported yet.")
        const formRow = form.append('div').attr('class', 'form-row')
        formRow.append('div').attr('class', 'form-col')
          .append('label').attr('for', 'acl-email').attr('class', 'label').text('Email');

        formRow.append('div').attr('class', 'form-col form-grow')
          .append('input')
            .attr('type', 'email')
            .attr('id', 'acl-email')
            .attr('class', 'input')
            .attr('placeholder', 'user@example.com')
            .attr('required', true);

        const roles = ['reader','editor','owner'];
        const roleRow = formRow.append('div').attr('class', 'form-col role-row')
          .append('div').attr('class', 'radio-group');

        roles.forEach((r, i) => {
          const id = `role-${r}`;
          const item = roleRow.append('label').attr('class', 'radio');
          item.append('input')
            .attr('type', 'radio')
            .attr('name', 'acl-role')
            .attr('value', r)
            .attr('id', id)
            .property('checked', i === 0);
          item.append('span').attr('class', 'radio-label').text(r);
        });

        formRow.append('button')
            .attr('type', 'submit')
            .attr('class', 'button addnew')
            .text('Grant access');

        form.append('div').attr('class', 'form-row').text("👀 Reader can see the dataset in graphs");
        form.append('div').attr('class', 'form-row').text("✏️ Editor can also sync the dataset on server");
        form.append('div').attr('class', 'form-row').text("👑 Owner can also delete the dataset from server plus manage access for other users");

        // super-simple email check
        const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

        form.on('submit', async (e) => {
          e.preventDefault();

          msg.attr('class', 'form-msg').text(""); // reset
          const email = form.select('#acl-email').property('value').trim();
          const role = form.select('input[name="acl-role"]:checked').property('value');

          if (!isEmail(email)) {
            msg.attr('class', 'form-msg is-error').text('Invalid email.'); 
            return;
          }

          const { error } = await supabaseClient.rpc('grant_acl_by_email', {
            _email: email,
            _scope: scope,
            _resource: resource,
            _level: role
          })

          if (error) {
            msg.attr('class', 'form-msg is-error').text(error.message || 'Insert failed.');
          } else {
            msg.attr('class', 'form-msg is-ok').text('Access granted');

            setTimeout(() => accessControlDialogCreate({scope, resource}), 1000);
          }
        });

      });
  }


  return;
  
}


export function accessControlDialogCancel(){
  d3.select(".admin-page").classed("blurry", false)
  d3.select(".access-control-dialog")
    .style("visibility", "hidden")
    .html("");
}